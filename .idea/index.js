//Json 파일 생성
// const xlsx = require('xlsx');
// const fs = require('fs');
//
// // 파일 읽기
// const workbook = xlsx.readFile('DataSheet.xlsx');
//
// // 시트 이름 중 "데이터"가 포함된 시트 필터링
// const sheetNames = workbook.SheetNames.filter(name => name.includes("데이터"));
//
// // 각 시트를 개별 JSON 파일로 저장
// sheetNames.forEach(sheetName => {
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);
//
//     // 파일 이름 설정 (예: "DataSheet_데이터1.json" 형태)
//     const fileName = `DataSheet_${sheetName}.json`;
//
//     // JSON 파일로 저장
//     fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');
//     console.log(`${fileName} 파일이 생성되었습니다!`);
// });

// 데이터 검색
const fs = require('fs');
const path = require('path');

// JSON 파일들이 저장된 폴더 경로
const folderPath = './'; // 현재 폴더에 저장된 경우

// 폴더 내 파일들을 읽어서 JSON 파일 필터링
const jsonFiles = fs.readdirSync(folderPath).filter(file => file.startsWith("DataSheet_") && file.endsWith(".json"));

// 파일 이름에 따라 조건을 설정하는 함수
function getFilterCondition(fileName) {
    if (fileName.includes("DataSheet_관광지")) {
        return item => item.주소.includes("강동구");  // DataSheet_1 조건
    } else if (fileName.includes("DataSheet_맛집")) {
        return item => item.분류.includes("찻집");    // DataSheet_2 조건
    } else if (fileName.includes("DataSheet_쇼핑")) {
        return item => item.분류.includes("관광");    // DataSheet_3 조건
    } else if (fileName.includes("DataSheet_숙소")) {
        return item => item.사업장명.includes("호텔");
    } else {
        return item => true;                        // 기본 조건 (모든 행 포함)
    }
}

// 각 JSON 파일을 읽고 파일별 조건에 맞는 행만 출력
jsonFiles.forEach(file => {
    const filePath = path.join(folderPath, file);

    // 파일 읽기 및 JSON 파싱
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // 파일 이름에 맞는 필터 조건 적용
    const filterCondition = getFilterCondition(file);
    const filterData = data.filter(filterCondition);

    console.log(`파일명: ${file}`);
    console.log("데이터:", filterData);
    console.log("=".repeat(70)); // 구분선
});

