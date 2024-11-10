const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// //Json 파일 생성
// // 파일 읽기
// const workbook = xlsx.readFile('./Data/DataSheet.xlsx');
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
//     const fileName = path.join("./Data",`DataSheet_${sheetName}.json`);
//
//     // JSON 파일로 저장
//     fs.writeFileSync(fileName, JSON.stringify(data, "./Data", 2), 'utf8');
//     console.log(`${fileName} 파일이 생성되었습니다!`);
// });

// 데이터 검색
// JSON 파일들이 저장된 폴더 경로
const folderPath = './Data'; // 현재 폴더에 저장된 경우

// 폴더 내 파일들을 읽어서 JSON 파일 필터링
const jsonFiles = fs.readdirSync(folderPath).filter(file => file.startsWith("DataSheet_") && file.endsWith(".json"));

// 파일 이름에 따라 조건을 설정하는 함수
function getFilterCondition(fileName) {
    if (fileName.includes("맛집")) {
        return item => item.분류.includes("한식");    // DataSheet_2 조건
    }
    else if (fileName.includes("쇼핑")) {
        return item => item.분류.includes("관광");    // DataSheet_3 조건
    }
    else if (fileName.includes("숙소")) {
        return item => item.사업장명.includes("호텔");
    }
    else {
        return item => true;                        // 기본 조건 (모든 행 포함)
    }
}

// 각 JSON 파일을 읽고 파일별 조건에 맞는 행만 출력
jsonFiles.forEach(file => {
    const filePath = path.join(folderPath, file);
    const sheetName = file.replace("DataSheet_", "").replace(".json", "");

    // 파일 읽기 및 JSON 파싱
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const filteredData = data.filter(item => item.주소.includes("강동구"));

    // 파일 이름에 맞는 필터 조건 적용
    const filterCondition = getFilterCondition(sheetName);
    const filterData = filteredData.filter(filterCondition);

    // const maleScore = filterData.forEach(item => {
    //     const sum = 0;
    //     if(item.includes("10")) {
    //         return sum += filterData[item];
    //     }
    // });
    //
    // console.log((maleScore));

    // // 데이터가 존재하지 않을 때, 예외 처리
    // if(filterData.length === 0) {
    //     console.log("데이터를 확인할 수 없음");
    //     console.log("=".repeat(70)); // 구분선
    // }
    // else {
    //     console.log(`파일명: ${file}`);
    //     console.log("데이터:", filterData);
    //     console.log("=".repeat(70)); // 구분선
    // }
});