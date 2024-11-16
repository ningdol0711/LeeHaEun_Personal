const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

//Json 파일 생성
// 파일 읽기
const workbook = xlsx.readFile('./Data/DataSheet.xlsx');

// 시트 이름 중 "데이터"가 포함된 시트 필터링
const sheetNames = workbook.SheetNames.filter(name => name.includes("데이터"));

// 각 시트를 개별 JSON 파일로 저장
sheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // 파일 이름 설정 (예: "DataSheet_데이터1.json" 형태)
    const fileName = path.join("./Data",`DataSheet_${sheetName}.json`);

    // JSON 파일로 저장
    fs.writeFileSync(fileName, JSON.stringify(data, "./Data", 2), 'utf8');
    console.log(`${fileName} 파일이 생성되었습니다!`);
});