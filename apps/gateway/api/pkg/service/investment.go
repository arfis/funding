package service

import (
	"errors"
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
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

	// CREATED A SIMULATION
	time.Sleep(time.Second * 1)

	log.Printf("AFTER SLEEP")
	defer projectLock.Unlock()
	if _, err := checkAvailableInvestment(investment.ProjectID, int64(investment.Amount)); err != nil {
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
					checkAndSoftDeleteInvestments()
				}
			}
		}()
	})
}

func checkAndSoftDeleteInvestments() {
	db := database.GetConnection()
	fmt.Printf("CHECKING")
	now := time.Now()
	var investments []dbModels.Investment

	result := db.Where("locked_until < ? AND approved = ? AND deleted_at is null", now, false).Find(&investments)
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
				minutesEnv = "10" // Default value if not set
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

func checkAvailableInvestment(projectId uuid.UUID, investment int64) (bool, error) {
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
