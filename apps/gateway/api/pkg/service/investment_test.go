package service

import (
	database "github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
	"sync"
	"testing"
	"time"
)

type MockDatabase struct {
	mock.Mock
}

func (m MockDatabase) Create(value interface{}) *gorm.DB {
	args := m.Called(value)
	return args.Get(0).(*gorm.DB) // Return whatever GORM would return
}

type DatabaseConnection struct{}

func TestCreateInvestmentConcurrency(t *testing.T) {
	service := NewInvestmentService(MockDatabase{})
	projectId := uuid.New()
	investment := &database.Investment{
		ProjectID: projectId,
		Amount:    100,
	}

	var wg sync.WaitGroup
	numGoroutines := 5
	wg.Add(numGoroutines)

	for i := 0; i < numGoroutines; i++ {
		go func() {
			defer wg.Done()
			_, err := service.CreateInvestment(investment)
			if err != nil {
				t.Errorf("Failed to create investment: %v", err)
			}
		}()
	}

	wg.Wait()

	// Verify that investments were processed serialized, check for data consistency
	// This might include checking the mock database's records, ensuring no data corruption
}

func TestNoDeadlock(t *testing.T) {
	service := NewInvestmentService(MockDatabase{})
	projectId := uuid.New()
	investment := &database.Investment{
		ProjectID: projectId,
		Amount:    100,
	}

	var wg sync.WaitGroup
	numGoroutines := 10
	wg.Add(numGoroutines)

	for i := 0; i < numGoroutines; i++ {
		go func() {
			defer wg.Done()
			_, err := service.CreateInvestment(investment)
			if err != nil {
				t.Errorf("Failed to create investment: %v", err)
			}
		}()
	}

	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()

	select {
	case <-done:
		// Passed, no deadlock
	case <-time.After(10 * time.Second):
		t.Fatal("Test did not complete in time, potential deadlock")
	}
}

func TestGetProjectLock(t *testing.T) {
	service := NewInvestmentService(MockDatabase{})
	projectId := uuid.New()

	lock1 := service.getProjectLock(projectId)
	lock2 := service.getProjectLock(projectId)

	if lock1 != lock2 {
		t.Errorf("Expected the same mutex for the same project ID")
	}

	newProjectId := uuid.New()
	lock3 := service.getProjectLock(newProjectId)
	if lock1 == lock3 {
		t.Errorf("Expected different mutexes for different project IDs")
	}
}
