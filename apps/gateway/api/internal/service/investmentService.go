package service

import (
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/google/uuid"
	"sync"
	"time"
)

type InvestmentService struct {
	db        DatabaseInterface
	lockMapMu sync.Mutex
	lockMap   map[uuid.UUID]*sync.Mutex
}

var (
	instance *InvestmentService
	once     sync.Once
)

func NewInvestmentService(db DatabaseInterface) *InvestmentService {
	once.Do(func() {
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

	if _, exists := s.lockMap[projectId]; !exists {
		s.lockMap[projectId] = &sync.Mutex{}
	}
	return s.lockMap[projectId]
}

func (s *InvestmentService) CreateInvestment(investment *database.Investment) (*database.Investment, error) {
	// Add business logic here, e.g., checking if the investment exceeds available slots, etc.
	// Then, save to database
	projectLock := s.getProjectLock(investment.ProjectID)
	projectLock.Lock()

	time.Sleep(time.Second * 4)
	defer projectLock.Unlock()
	_, err := checkAvailableInvestment(investment.ProjectID, int64(investment.Amount))

	if err != nil {
		return nil, err
	}

	result := s.db.Create(investment)
	if result.Error != nil {
		return nil, result.Error
	}
	return investment, nil
}
