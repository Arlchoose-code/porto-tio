package services

import (
	"strings"
)

func SanitizeHTML(input string) string {
	// Trim unnecessary whitespace
	return strings.TrimSpace(input)
}
