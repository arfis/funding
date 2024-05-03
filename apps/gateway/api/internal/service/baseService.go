package service

import database "github.com/arfis/crowd-funding/gateway/internal/db"

var databaseConnection = database.GetConnection()
