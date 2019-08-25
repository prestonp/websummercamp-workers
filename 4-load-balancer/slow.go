package main

import (
	"fmt"
	"net/http"
	"time"
)

func main() {
	err := http.ListenAndServe(":8080", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(3 * time.Second)
		fmt.Fprintf(w, "hello world")
	}))
	if err != nil {
		panic(err)
	}
}
