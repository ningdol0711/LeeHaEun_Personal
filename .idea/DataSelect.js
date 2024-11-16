const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// 데이터 검색
// JSON 파일들이 저장된 폴더 경로
const folderPath = './Data'; // 현재 폴더에 저장된 경우

// 폴더 내 파일들을 읽어서 JSON 파일 필터링
const jsonFiles = fs.readdirSync(folderPath).filter(file => file.startsWith("DataSheet_") && file.endsWith(".json"));

// 조건 설정
const local = "강남구";
const tem = "역사";
const food = "한식";
const stay = "호텔";
const age = 10;
const day = 3;

// 파일 이름에 따라 조건을 설정하는 함수
function getFilterCondition(fileName) {
  if (fileName.includes("관광지")) {
    return item => item.대분류명.includes(tem);
  }
  else if (fileName.includes("맛집")) {
    return item => item.분류.includes(food);    // 맛집 데이터 조건
  }
  else if (fileName.includes("숙소")) {
    return item => item.상호명.includes(stay);   // 숙소 데이터 조건
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

  // 지역 선택
  const filteredData = data.filter(item => item.주소.includes(local));

  // 파일 이름에 맞는 필터 조건 적용
  const filterCondition = getFilterCondition(sheetName);
  const endData = filteredData.filter(filterCondition);

  // 연령대별 관광지 선호도 정렬
  if(sheetName.includes("관광지")) {
    endData.sort((a, b) => {
      if(a['비율_${age}대'] > b['비율_${age}대']) return -1;
      if(a['비율_${age}대'] < b['비율_${age}대']) return 1;
    });
  }

  // 맛집 순위 정렬
  if(sheetName.includes("맛집")) {
    endData.sort((a, b) => {
      if(a.순위 > b.순위) return 1;
      if(a.순위 < b.순위) return -1;
    });
  }

  // 쇼핑 순위 정렬
  if(sheetName.includes("쇼핑")) {
    endData.sort((a, b) => {
      if(a.순위 > b.순위) return 1;
      if(a.순위 < b.순위) return -1;
    });
  }

  // 데이터가 존재하지 않을 때, 예외 처리
  // 데이터가 존재하지 않을 때, 예외 처리
  if (endData.length === 0) {
    console.log("데이터를 확인할 수 없음");
    console.log("=".repeat(70)); // 구분선
  } else {
    if (sheetName.includes("숙소")) {
      for (let i = 0; i < day - 1; i++) {
        if (endData[i]) { // 데이터 검증
          console.log(endData[i].상호명 || "정보 없음", endData[i].전화번호 || "정보 없음", endData[i].주소 || "정보 없음");
        } else {
          console.log("데이터를 확인할 수 없음");
        }
      }
    } else {
      for (let i = 0; i < day; i++) {
        if (endData[i]) { // 데이터 검증
          console.log(endData[i].상호명 || "정보 없음", endData[i].전화번호 || "정보 없음", endData[i].주소 || "정보 없음");
        } else {
          console.log("데이터를 확인할 수 없음");
        }
      }
    }
    console.log("=".repeat(70));
  }

});