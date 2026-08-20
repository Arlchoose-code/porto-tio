package services

import (
	"fmt"
	"regexp"
	"strings"

	"gorm.io/gorm"
)

func Slugify(text string) string {
	slug := strings.ToLower(text)
	reg := regexp.MustCompile("[^a-z0-9]+")
	slug = reg.ReplaceAllString(slug, "-")
	slug = strings.Trim(slug, "-")
	if slug == "" {
		slug = "untitled"
	}
	return slug
}

func GenerateUniqueSlug(db *gorm.DB, tableName, title string, currentID uint) string {
	baseSlug := Slugify(title)
	slug := baseSlug
	counter := 1

	for {
		var count int64
		query := db.Table(tableName).Where("slug = ?", slug)
		if currentID > 0 {
			query = query.Where("id != ?", currentID)
		}
		query.Count(&count)
		if count == 0 {
			break
		}
		counter++
		slug = fmt.Sprintf("%s-%d", baseSlug, counter)
	}

	return slug
}
