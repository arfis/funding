package user

import (
	"errors"
	"fmt"
	database "github.com/arfis/crowd-funding/authorization/internal/db"
	"github.com/jackc/pgx/v5/pgconn"
)

func CreateUser(user *database.User) (*database.User, error) {

	if existingUser := FindUserByExternalId(user.ExternalID); existingUser == nil {
		fmt.Println("NO existing user")
		result := database.GetConnection().Create(&user)
		if result.Error != nil {
			if isDuplicateEntryError(result.Error) {
				// Handle the case where the user already exists, perhaps fetch and return that user
				var existingUser database.User
				database.GetConnection().Where("external_id = ?", user.ExternalID).First(&existingUser)
				return &existingUser, nil
			}
			return nil, result.Error
		}

		return user, nil
	} else {
		fmt.Println("There was an existing user")
		return existingUser, nil
	}

}

func FindUserByExternalId(externalId string) *database.User {
	var user database.User
	result := database.GetConnection().Where("external_id = ? AND deleted_at IS NULL", externalId).First(&user)
	if result.Error != nil {
		return nil // User not found
		// Handle other potential errors, maybe log them or handle them however you see fit
	}
	return &user
}

func isDuplicateEntryError(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return true
	}
	return false
}

type UserError struct {
	Message string
}
