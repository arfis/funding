package mathUtil

import "math"

func ParseToFloat(value int64, precision int) float64 {
	return float64(value) / math.Pow(10, float64(precision))
}
