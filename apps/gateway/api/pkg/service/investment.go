package service

import (
	"errors"
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/arfis/crowd-funding/gateway/pkg/mathUtil"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
	"os"
	"strconv"
	"sync"
	"time"
)

var (
	instance       *InvestmentService
	once           sync.Once
	instanceOnce   sync.Once
	projectService ProjectService
	ethScan        EthScan
)

type InvestmentService struct {
	db        *gorm.DB
	lockMapMu sync.Mutex
	lockMap   map[uuid.UUID]*sync.Mutex
}

func NewInvestmentService(db *gorm.DB) *InvestmentService {
	instanceOnce.Do(func() {
		instance = &InvestmentService{
			db:      db,
			lockMap: make(map[uuid.UUID]*sync.Mutex),
		}
	})
	return instance
}

func (s *InvestmentService) getProjectLock(projectId uuid.UUID) *sync.Mutex {
	s.lockMapMu.Lock()
	defer s.lockMapMu.Unlock()
	log.Printf("GETTING PROJECT LOCK")
	if _, exists := s.lockMap[projectId]; !exists {
		s.lockMap[projectId] = &sync.Mutex{}
	}
	return s.lockMap[projectId]
}

func (s *InvestmentService) CreateInvestment(investment *dbModels.Investment) (*dbModels.Investment, error) {
	// Add business logic here, e.g., checking if the investment exceeds available slots, etc.
	// Then, save to database
	projectLock := s.getProjectLock(investment.ProjectID)
	projectLock.Lock()
	log.Println("CREATING INVESTMENT")
	defer projectLock.Unlock()
	investmentAmount := mathUtil.ParseToFloat(int64(investment.Amount), investment.Precision)
	if _, err := checkAvailableInvestment(investment.ProjectID, investmentAmount); err != nil {
		return nil, err
	}

	if _, err := calculateInvestmentLock(investment); err != nil {
		return nil, err
	}

	result := s.db.Create(investment)
	if result.Error != nil {
		log.Printf("There was an error %v", result.Error)
		return nil, result.Error
	}
	return investment, nil
}

func (s *InvestmentService) StartTicker(interval int32) {
	once.Do(func() {
		go func() {
			ticker := time.NewTicker(time.Duration(interval) * time.Second)
			defer ticker.Stop()

			for {
				select {
				case <-ticker.C:
					fmt.Println("Ticker ticked at", time.Now())
					checkInvestmentStatus()
					softDeleteNonTransactionalInvestments()
				}
			}
		}()
	})
}

func checkInvestmentStatus() {
	log.Println("CHECK INVESTMENt STATUS")
	var investments []dbModels.Investment
	var database = database.GetConnection()
	// Fetch all investments with pending status
	result := database.Where("status IN ?", []string{"pending", ""}).Find(&investments)
	if result.Error != nil {
		log.Println("failed to fetch investments:", result.Error)
		return
	}

	for _, investment := range investments {
		txStatus, err := ethScan.GetTxStatus(investment.TxHash)
		if err != nil {
			log.Println("failed to get transaction status for", investment.TxHash, ":", err)
			continue
		}

		// Update the investment status based on the transaction status
		if txStatus == "success" {
			investment.Status = "approved"
		} else if txStatus == "fail" {
			investment.Status = "failed"
		}

		// Save the updated investment status to the database
		err = database.Save(&investment).Error
		if err != nil {
			log.Println("failed to update investment status:", err)
		}
	}
}

func (s *InvestmentService) GetInvestmentByID(id uuid.UUID) (*dbModels.Investment, error) {
	log.Printf("GETTING INVESTMENT BY ID %s", id)
	var investment dbModels.Investment
	if err := s.db.First(&investment, "id = ?", id).Error; err != nil {
		log.Printf("failed to find investment with id %s: %v", id, err)
		return nil, err
	}
	log.Println("GOT INVESTMENT?!")
	return &investment, nil
}

func (s *InvestmentService) UpdateInvestment(investment *dbModels.Investment) (*dbModels.Investment, error) {
	log.Println("UPDATING INVESTMENT 3")
	if err := s.db.Save(investment).Error; err != nil {
		return nil, err
	}
	return investment, nil
}

func softDeleteNonTransactionalInvestments() {
	db := database.GetConnection()
	fmt.Printf("CHECKING")
	now := time.Now()
	var investments []dbModels.Investment

	result := db.Where("locked_until < ? AND tx_hash is null AND deleted_at is null", now).Find(&investments)
	if result.Error != nil {
		fmt.Println("Error fetching investments:", result.Error)
		return
	}

	for _, investment := range investments {
		// Soft delete the investment
		if result := db.Delete(&investment); result.Error != nil {
			fmt.Println("Error deleting investment:", result.Error)
		} else {
			fmt.Printf("Soft deleted investment ID %s\n", investment.ID)
		}
	}
}

func calculateInvestmentLock(investment *dbModels.Investment) (*dbModels.Investment, error) {
	if foundProject, err := projectService.GetProjectByID(investment.ProjectID); err != nil {
		return nil, err
	} else {

		if foundProject.Type == enum.CryptoInvestment {
			minutesEnv := os.Getenv("INVESTMENT_LOCK_MINUTES")
			fmt.Printf("Locked Until: %d", minutesEnv)
			if minutesEnv == "" {
				fmt.Println("INVESTMENT_LOCK_MINUTES not set, defaulting to 10 minutes")
				minutesEnv = "1" // Default value if not set
			}

			minutes, err := strconv.Atoi(minutesEnv)
			if err != nil {
				fmt.Printf("Error converting INVESTMENT_LOCK_MINUTES to integer: %s\n", err)
				return investment, err
			}
			now := time.Now()

			lockedTime := now.Add(time.Duration(minutes) * time.Minute)
			investment.LockedUntil = &lockedTime
			fmt.Println("Locked Until:", investment.LockedUntil.Format("2006-01-02 15:04:05"))
		} else {
			investment.Approved = true
			investment.LockedUntil = nil
			return investment, nil
		}

	}

	return investment, nil
}

func checkAvailableInvestment(projectId uuid.UUID, investment float64) (bool, error) {
	freeAllocation, err := GetAvailableAllocation(projectId)
	if err != nil {
		return false, err
	}
	// Check if adding this investment exceeds the allocation
	if freeAllocation-investment <= 0 {
		return false, errors.New("investment exceeds project allocation")
	}

	return true, nil
}
