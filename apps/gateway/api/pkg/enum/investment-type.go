package enum

import (
	"fmt"
	"github.com/graphql-go/graphql"
)

// InvestmentType is a custom type for the investment enum
type InvestmentType int

// Defining enum values for InvestmentType using iota
const (
	CryptoInvestment InvestmentType = iota
	ClassicInvestment
	Unknown
)

// String method to get the string representation of the InvestmentType
func (i InvestmentType) String() string {
	return [...]string{"CRYPTO_INVESTMENT", "CLASSIC_INVESTMENT", "UNKNOWN"}[i]
}

// ParseInvestmentType parses a string into an InvestmentType
func ParseInvestmentType(input string) (InvestmentType, error) {
	switch input {
	case "CRYPTO_INVESTMENT":
		return CryptoInvestment, nil
	case "CLASSIC_INVESTMENT":
		return ClassicInvestment, nil
	case "UNKNOWN":
		return Unknown, nil
	default:
		return 0, fmt.Errorf("invalid InvestmentType: %s", input)
	}
}

// GetInvestmentTypeEnum generates a GraphQL enum type from the InvestmentType Go enum
func GetInvestmentTypeEnum() *graphql.Enum {
	return graphql.NewEnum(graphql.EnumConfig{
		Name: "InvestmentType",
		Values: graphql.EnumValueConfigMap{
			"CRYPTO_INVESTMENT": &graphql.EnumValueConfig{
				Value: "CRYPTO_INVESTMENT",
			},
			"CLASSIC_INVESTMENT": &graphql.EnumValueConfig{
				Value: "CLASSIC_INVESTMENT",
			},
			"UNKNOWN": &graphql.EnumValueConfig{
				Value: "UNKNOWN",
			},
		},
	})
}

// Define a global variable for the InvestmentType enum
var InvestmentTypeEnum = GetInvestmentTypeEnum()
