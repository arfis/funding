package authorization

type UserType string

const (
	Onboarded UserType = "ONBOARDED"
	Admin     UserType = "ADMIN"
)

func (userType UserType) GetString() string {
	return string(userType)
}
