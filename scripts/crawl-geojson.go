package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type AreaLevel string

const (
	AreaLevelProvince AreaLevel = "province"
	AreaLevelCity     AreaLevel = "city"
	AreaLevelDistrict AreaLevel = "district"
)

type Area struct {
	Name   string    `json:"name"`
	Adcode int       `json:"adcode"`
	Parent int       `json:"parent"`
	Level  AreaLevel `json:"level"`
	Lng    float64   `json:"lng"`
	Lat    float64   `json:"lat"`
}

const (
	geojsonPath = "public/json/geo"
)

func main() {
	makeGeojsonDir()
	adcodes := getAreaAdcodes()
	crawl(adcodes)
}

// 错误处理
func check(e error) {
	if e != nil {
		fmt.Println(e)
	}
}

// 创建 geojson 文件夹
func makeGeojsonDir() {
	if _, err := os.Stat(geojsonPath); os.IsNotExist(err) {
		err := os.Mkdir(geojsonPath, 0755)
		check(err)
	}
}

// 写入 geojson 到文件
func writeGeojson(adcode int, data []byte) {
	filename := fmt.Sprintf("%d.json", adcode)
	filepath := fmt.Sprintf("%s/%s", geojsonPath, filename)
	f, err := os.Create(filepath)
	check(err)

	defer f.Close()

	fb, err := f.Write(data)
	check(err)
	fmt.Printf("%s wrote %d bytes\n", filename, fb)
}

// 爬取 geojson
func getAreaGeojson(adcode int) ([]byte, error) {
	reqUrl := fmt.Sprintf("https://geo.datav.aliyun.com/areas_v3/bound/%d_full.json", adcode)
	resp, err := http.Get(reqUrl)
	check(err)

	if resp.StatusCode != 200 {
		return nil, errors.New(fmt.Sprintf("crawl geojson failed, statusCode: %d, status: %s\n", resp.StatusCode, resp.Status))
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	check(err)

	return body, nil
}

// 获取要抓取区域的 adcode
func getAreaAdcodes() []int {
	areasBytes, err := os.ReadFile("./public/json/all-area.json")
	check(err)

	var areas []Area
	err = json.Unmarshal(areasBytes, &areas)
	check(err)

	var adcodes []int
	for _, area := range areas {
		adcodes = append(adcodes, area.Adcode)
	}

	return adcodes
}

func crawl(adcodes []int) {
	for index, adcode := range adcodes {
		json, err := getAreaGeojson(adcode)

		if index%2 != 0 {
			time.Sleep(1 * time.Second)
		}

		if err != nil {
			fmt.Printf("%d: %v", adcode, err)
			continue
		}

		writeGeojson(adcode, json)
	}
}
