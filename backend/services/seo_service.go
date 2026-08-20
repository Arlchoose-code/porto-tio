package services

import (
	"encoding/json"
	"fmt"

	"portfolio-backend/models"

	"gorm.io/gorm"
)

type BreadcrumbItem struct {
	Type     string `json:"@type"`
	Position int    `json:"position"`
	Name     string `json:"name"`
	Item     string `json:"item"`
}

type BreadcrumbListSchema struct {
	Context         string           `json:"@context"`
	Type            string           `json:"@type"`
	ItemListElement []BreadcrumbItem `json:"itemListElement"`
}

func GenerateBreadcrumbJSONLD(siteURL string, items []struct{ Name, Path string }) string {
	var list []BreadcrumbItem
	for i, item := range items {
		list = append(list, BreadcrumbItem{
			Type:     "ListItem",
			Position: i + 1,
			Name:     item.Name,
			Item:     fmt.Sprintf("%s%s", siteURL, item.Path),
		})
	}

	schema := BreadcrumbListSchema{
		Context:         "https://schema.org",
		Type:            "BreadcrumbList",
		ItemListElement: list,
	}

	bytes, _ := json.Marshal(schema)
	return string(bytes)
}

func GetSeoForPath(db *gorm.DB, path string) (*models.SeoSetting, error) {
	var seo models.SeoSetting
	err := db.Where("path = ?", path).First(&seo).Error
	if err != nil {
		// Fallback to default
		return &models.SeoSetting{
			Path:            path,
			MetaTitle:       "Sulistio Murti Mulyono — Digital Business & Project Management",
			MetaDescription: "Official portfolio of Sulistio Murti Mulyono (Tio). Connecting Business, Technology, Data, and People to Deliver Impact.",
		}, nil
	}
	return &seo, nil
}
