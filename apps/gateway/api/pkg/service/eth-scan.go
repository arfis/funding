package service

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type EthScan struct {
}

func (ethScan *EthScan) GetTxStatus(txHash string) (string, error) {
	var apiKey = "6KYM39K3HGR514IEXU5XPU8FVDRSXKTTMZ"

	log.Println("Getting tx status")
	type TxReceipt struct {
		Status string `json:"status"`
	}
	type Response struct {
		Status  string    `json:"status"`
		Message string    `json:"message"`
		Result  TxReceipt `json:"result"`
		Error   string    `json:"error"`
	}

	if txHash == "" {
		return "", fmt.Errorf("No tx hash")
	}
	// Use Sepolia endpoint to get transaction status
	url := fmt.Sprintf("https://api-sepolia.etherscan.io/api?module=transaction&txhash=%s&apikey=%s", txHash, apiKey)
	resp, err := http.Get(url)
	log.Printf("The url is %s", url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var response map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", err
	}

	if status, ok := response["status"].(string); ok && status != "1" {
		return "", fmt.Errorf("API error: %s", response["message"])
	}

	result, ok := response["result"].(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("failed to parse result field")
	}

	txStatus, ok := result["status"].(string)
	if !ok {
		return "", fmt.Errorf("failed to parse transaction status")
	}

	if txStatus == "1" {
		return "success", nil
	} else if txStatus == "0" {
		return "fail", nil
	}

	return "pending", nil
}
