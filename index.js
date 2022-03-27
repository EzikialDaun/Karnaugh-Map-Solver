window.onload = () => {
  const MARK_TRUE = `1`
  const MARK_FALSE = `0`
  const MARK_DCARE = `X`
  const MIN_DEGREE = 2
  const MAX_DEGREE = 4
  const GROUP_SUBSTRING_1BIT = [
    `0`,
    `1`,
  ]
  const GROUP_SUBSTRING_2BIT = [
    `00`,
    `01`,
    `11`,
    `10`,
  ]
  let degreeInput
  let cellArray = []
  let groupCount = 0
  let columnMaxCount
  let rowMaxCount
  const createTable = document.getElementById(`createTable`)
  createTable.addEventListener(`click`, () => {
    const inputTag = document.getElementById(`degree`)
    const degree = inputTag?.value * 1
    if (degree >= MIN_DEGREE && degree <= MAX_DEGREE) {
      degreeInput = degree
      createMap(degreeInput)
    }
    else {
      degreeInput = 2
      inputTag.value = degreeInput
      createMap(degreeInput)
    }
    const result = document.getElementById(`result`)
    result.innerText = ``
  })
  const startProgram = document.getElementById(`startProgram`)
  startProgram.addEventListener(`click`, () => {
    const columnCount = Math.floor(degreeInput / 2 + degreeInput % 2)
    const rowCount = Math.floor(degreeInput / 2)
    columnMaxCount = Math.pow(2, columnCount)
    rowMaxCount = Math.pow(2, rowCount)
    let count = 0
    cellArray = []
    for (let i = 0; i < rowMaxCount; i++) {
      cellArray.push([])
      for (let j = 0; j < columnMaxCount; j++) {
        cellArray[i].push([])
        const button = document.getElementById(`cell-${count}`)
        cellArray[i][j] = button.innerText
        count++
      }
    }
    let minimizedGroupCount
    const minimizedGroupList = []
    const groupList = []
    groupCount = findGroup(cellArray, groupList)
    minimizedGroupCount = selectSubset(groupList, cellArray, groupCount, minimizedGroupList)
    const result = document.getElementById(`result`)
    const equation = getEquation(minimizedGroupList, minimizedGroupCount)
    result.innerText = equation
  })
  const cellClicked = (e) => {
    const target = e.target
    const value = target.innerText
    switch (value) {
      case MARK_TRUE:
        target.innerText = MARK_DCARE
        break;
      case MARK_FALSE:
        target.innerText = MARK_TRUE
        break;
      case MARK_DCARE:
        target.innerText = MARK_FALSE
        break
      default:
        break
    }
  }
  const getBinaryArray = (input) => {
    let result = []
    switch (input) {
      case 1:
        result = [
          `0`,
          `1`,
        ]
        break;
      case 2:
        result = [
          `00`,
          `01`,
          `11`,
          `10`,
        ]
        break;
      case 3:
        result = [
          `000`,
          `001`,
          `011`,
          `010`,
          `110`,
          `111`,
          `101`,
          `100`,
        ]
        break;
      default:
        break;
    }
    return result
  }
  const createMap = (input) => {
    if (input >= MIN_DEGREE && input <= MAX_DEGREE) {
      const map = document.getElementById(`map`)
      map.innerHTML = ``
      const createThead = (columnCount) => {
        const thead = document.createElement(`thead`)
        const createColumn = (count) => {
          const columnLine = document.createElement(`tr`)
          const emptyCell = document.createElement(`td`)
          columnLine.appendChild(emptyCell)
          let columnArray = getBinaryArray(count)
          columnArray.forEach(element => {
            const td = document.createElement(`td`)
            const span = document.createElement(`span`)
            span.innerText = element
            td.appendChild(span)
            columnLine.appendChild(td)
          });
          return columnLine
        }
        const column = createColumn(columnCount)
        thead.appendChild(column)
        return thead
      }
      const createTbody = (columnCount, rowCount) => {
        const result = document.createElement(`tbody`)
        let rowArray = getBinaryArray(rowCount)
        const tryCount = Math.pow(2, columnCount)
        let count = 0
        rowArray.forEach(element => {
          const tr = document.createElement(`tr`)
          const firstCell = document.createElement(`td`)
          const firstSpan = document.createElement(`span`)
          firstSpan.innerText = element
          firstCell.appendChild(firstSpan)
          tr.appendChild(firstCell)
          for (let i = 0; i < tryCount; i++) {
            const cell = document.createElement(`td`)
            const button = document.createElement(`button`)
            button.addEventListener(`click`, (e) => {
              cellClicked(e)
            })
            button.innerText = MARK_FALSE
            button.type = `button`
            button.id = `cell-${count}`
            count++
            cell.appendChild(button)
            tr.appendChild(cell)
          }
          result.appendChild(tr)
        });
        return result
      }
      const columnCount = Math.floor(input / 2 + input % 2)
      const rowCount = Math.floor(input / 2)
      const thead = createThead(columnCount)
      const tbody = createTbody(columnCount, rowCount)
      map.appendChild(thead)
      map.appendChild(tbody)
    }
    else {

    }
  }
  const findGroup = (map, groupList) => {
    groupCount = 0
    find1CellGroup(map, groupList)
    find2CellGroup(map, groupList)
    find4CellGroup(map, groupList)
    find8CellGroup(map, groupList)
    find16CellGroup(map, groupList)
    return groupCount
  }
  const find1CellGroup = (map, groupList) => {
    for (let i = 0; i < rowMaxCount; i++) {
      for (let j = 0; j < columnMaxCount; j++) {
        if (map[i][j] === MARK_TRUE) {
          let a, b, c, d
          let result
          switch (degreeInput) {
            case 2:
              a = GROUP_SUBSTRING_1BIT[i].charAt(0)
              b = GROUP_SUBSTRING_1BIT[j].charAt(0)
              result = `${a}${b}`
              break;
            case 3:
              a = GROUP_SUBSTRING_1BIT[i].charAt(0)
              b = GROUP_SUBSTRING_2BIT[j].charAt(0)
              c = GROUP_SUBSTRING_2BIT[j].charAt(1)
              result = `${a}${b}${c}`
              break;
            case 4:
              a = GROUP_SUBSTRING_2BIT[i].charAt(0)
              b = GROUP_SUBSTRING_2BIT[i].charAt(1)
              c = GROUP_SUBSTRING_2BIT[j].charAt(0)
              d = GROUP_SUBSTRING_2BIT[j].charAt(1)
              result = `${a}${b}${c}${d}`
              break;
            default:
              break;
          }
          groupList.push(result)
          groupCount++
        }
      }
    }
  }
  const find2CellGroup = (map, groupList) => {
    if (columnMaxCount >= 2 && rowMaxCount >= 1) {
      find1n2Group(map, groupList)
    }
    if (columnMaxCount >= 1 && rowMaxCount >= 2) {
      find2n1Group(map, groupList)
    }
  }
  const find1n2Group = (map, groupList) => {
    let row1, col1, col2
    // 가로 형태 16개 검사
    for (let i = 0; i < rowMaxCount; i++) {
      for (let j = 0; j < columnMaxCount; j++) {
        row1 = i
        col1 = j
        col2 = (j + 1) % columnMaxCount
        if (map[row1][col1] === MARK_TRUE && map[row1][col2] === MARK_TRUE || map[row1][col1] === MARK_DCARE && map[row1][col2] === MARK_TRUE || map[row1][col1] === MARK_TRUE && map[row1][col2] === MARK_DCARE) {
          let a, b, c, d
          let result
          switch (degreeInput) {
            case 2:
              a = GROUP_SUBSTRING_1BIT[row1].charAt(0)
              b = `*`
              result = `${a}${b}`
              break;
            case 3:
              a = GROUP_SUBSTRING_1BIT[row1].charAt(0)
              if (GROUP_SUBSTRING_2BIT[col1].charAt(0) === GROUP_SUBSTRING_2BIT[col2].charAt(0)) {
                b = GROUP_SUBSTRING_2BIT[col1].charAt(0)
                c = `*`
              }
              else {
                b = `*`
                c = GROUP_SUBSTRING_2BIT[col1].charAt(1)
              }
              result = `${a}${b}${c}`
              break;
            case 4:
              a = GROUP_SUBSTRING_2BIT[row1].charAt(0)
              b = GROUP_SUBSTRING_2BIT[row1].charAt(1)
              if (GROUP_SUBSTRING_2BIT[col1].charAt(0) === GROUP_SUBSTRING_2BIT[col2].charAt(0)) {
                c = GROUP_SUBSTRING_2BIT[col1].charAt(0)
                d = `*`
              }
              else {
                c = `*`
                d = GROUP_SUBSTRING_2BIT[col1].charAt(1)
              }
              result = `${a}${b}${c}${d}`
              break;
            default:
              break;
          }
          groupList.push(result)
          groupCount++
        }
      }
    }
  }
  const find2n1Group = (map, groupList) => {
    let row1, row2, col1
    // 세로 형태 16개 검사
    for (let i = 0; i < rowMaxCount; i++) {
      for (let j = 0; j < columnMaxCount; j++) {
        row1 = i
        row2 = (i + 1) % rowMaxCount
        col1 = j
        if (map[row1][col1] === MARK_TRUE && map[row2][col1] === MARK_TRUE || map[row1][col1] === MARK_DCARE && map[row2][col1] === MARK_TRUE || map[row1][col1] === MARK_TRUE && map[row2][col1] === MARK_DCARE) {
          let a, b, c, d
          let result
          switch (degreeInput) {
            case 2:
              a = `*`
              b = GROUP_SUBSTRING_1BIT[col1].charAt(0)
              result = `${a}${b}`
              break;
            case 3:
              a = `*`
              b = GROUP_SUBSTRING_2BIT[col1].charAt(0)
              c = GROUP_SUBSTRING_2BIT[col1].charAt(1)
              result = `${a}${b}${c}`
              break;
            case 4:
              if (GROUP_SUBSTRING_2BIT[row1].charAt(0) === GROUP_SUBSTRING_2BIT[row2].charAt(0)) {
                a = GROUP_SUBSTRING_2BIT[row1].charAt(0)
                b = `*`
              }
              else {
                a = `*`
                b = GROUP_SUBSTRING_2BIT[row1].charAt(1)
              }
              c = GROUP_SUBSTRING_2BIT[col1].charAt(0)
              d = GROUP_SUBSTRING_2BIT[col1].charAt(1)
              result = `${a}${b}${c}${d}`
              break;
            default:
              break;
          }
          groupList.push(result)
          groupCount++
        }
      }
    }
  }
  const find4CellGroup = (map, groupList) => {
    if (columnMaxCount >= 4 && rowMaxCount >= 1) {
      find1n4Group(map, groupList)
    }
    if (columnMaxCount >= 1 && rowMaxCount >= 4) {
      find4n1Group(map, groupList)
    }
    if (columnMaxCount >= 2 && rowMaxCount >= 2) {
      find2n2Group(map, groupList)
    }
  }
  const find1n4Group = (map, groupList) => {
    const MAX_DCARE_COUNT = 4
    let isGroupPossible
    // 1 * 4 형태 4가지 검사
    for (let i = 0; i < rowMaxCount; i++) {
      isGroupPossible = true
      let DCareCount = 0
      for (let j = 0; j < columnMaxCount; j++) {
        if (map[i][j] === MARK_FALSE) {
          isGroupPossible = false;
          break;
        }
        else if (map[i][j] === MARK_DCARE) {
          DCareCount++
        }
      }
      if (isGroupPossible === true && DCareCount < MAX_DCARE_COUNT) {
        let a, b, c, d
        let result
        switch (degreeInput) {
          case 3:
            a = GROUP_SUBSTRING_1BIT[i].charAt(0)
            b = `*`
            c = `*`
            result = `${a}${b}${c}`
            break;
          case 4:
            a = GROUP_SUBSTRING_2BIT[i].charAt(0)
            b = GROUP_SUBSTRING_2BIT[i].charAt(1)
            c = `*`
            d = `*`
            result = `${a}${b}${c}${d}`
            break;
          default:
            break;
        }
        groupList.push(result)
        groupCount++
      }
    }
  }
  const find4n1Group = (map, groupList) => {
    const MAX_DCARE_COUNT = 4
    let isGroupPossible
    // 4 * 1 형태 4가지 검사
    for (let i = 0; i < rowMaxCount; i++) {
      isGroupPossible = true
      let DCareCount = 0
      for (let j = 0; j < columnMaxCount; j++) {
        if (map[j][i] === MARK_FALSE) {
          isGroupPossible = false;
          break;
        }
        else if (map[j][i] === MARK_DCARE) {
          DCareCount++
        }
      }
      if (isGroupPossible === true && DCareCount < MAX_DCARE_COUNT) {
        let a, b, c, d
        let result
        switch (degreeInput) {
          case 4:
            a = `*`
            b = `*`
            c = GROUP_SUBSTRING_2BIT[i].charAt(0)
            d = GROUP_SUBSTRING_2BIT[i].charAt(1)
            result = `${a}${b}${c}${d}`
            break;
          default:
            break;
        }
        groupList.push(result)
        groupCount++
      }
    }
  }
  const find2n2Group = (map, groupList) => {
    let isGroupPossible, x1, x2, y1, y2
    // 2 * 2 형태 16가지 검사
    for (let i = 0; i < rowMaxCount; i++) {
      for (let j = 0; j < columnMaxCount; j++) {
        x1 = j
        x2 = (j + 1) % columnMaxCount
        y1 = i
        y2 = (i + 1) % rowMaxCount
        const tempArray = [
          map[y1][x1],
          map[y1][x2],
          map[y2][x1],
          map[y2][x2],
        ]
        isGroupPossible = tempArray.every((iter) => iter === MARK_TRUE || iter === MARK_DCARE) && !tempArray.every((iter) => iter === MARK_DCARE)
        if (isGroupPossible === true) {
          let a, b, c, d
          let result
          switch (degreeInput) {
            case 2:
              a = `*`
              b = `*`
              result = `${a}${b}`
              break;
            case 3:
              // 행 문자, AB
              a = `*`
              // 열 문자, CD
              if (GROUP_SUBSTRING_2BIT[x1].charAt(0) == GROUP_SUBSTRING_2BIT[x2].charAt(0)) {
                // C 동일
                b = GROUP_SUBSTRING_2BIT[x1].charAt(0)
                c = `*`
              }
              else {
                // D 동일 
                b = `*`
                c = GROUP_SUBSTRING_2BIT[x1].charAt(1)
              }
              result = `${a}${b}${c}`
              break;
            case 4:
              // 행 문자, AB
              if (GROUP_SUBSTRING_2BIT[y1].charAt(0) == GROUP_SUBSTRING_2BIT[y2].charAt(0)) {
                // A 동일
                a = GROUP_SUBSTRING_2BIT[y1].charAt(0)
                b = `*`
              }
              else {
                // B 동일 
                a = `*`
                b = GROUP_SUBSTRING_2BIT[y1].charAt(1)
              }
              // 열 문자, CD
              if (GROUP_SUBSTRING_2BIT[x1].charAt(0) == GROUP_SUBSTRING_2BIT[x2].charAt(0)) {
                // C 동일
                c = GROUP_SUBSTRING_2BIT[x1].charAt(0)
                d = `*`
              }
              else {
                // D 동일 
                c = `*`
                d = GROUP_SUBSTRING_2BIT[x1].charAt(1)
              }
              result = `${a}${b}${c}${d}`
              break;
            default:
              break;
          }
          groupList.push(result)
          groupCount++
        }
      }
    }
  }
  const find8CellGroup = (map, groupList) => {
    if (columnMaxCount >= 4 && rowMaxCount >= 2) {
      find2n4Group(map, groupList)
    }
    if (columnMaxCount >= 2 && rowMaxCount >= 4) {
      find4n2Group(map, groupList)
    }
  }
  const find4n2Group = (map, groupList) => {
    const MAX_DCARE_COUNT = 8
    let isGroupPossible
    let col1, col2
    // 4 * 2 형태 4가지 검사
    for (let i = 0; i < rowMaxCount; i++) {
      col1 = i
      col2 = (i + 1) % rowMaxCount
      isGroupPossible = true
      let DCareCount = 0
      for (let j = 0; j < columnMaxCount; j++) {
        if (map[j][col1] === MARK_DCARE) {
          DCareCount++
        }
        if (map[j][col2] === MARK_DCARE) {
          DCareCount++
        }
        if (map[j][col1] === MARK_FALSE || map[j][col2] === MARK_FALSE) {
          isGroupPossible = false
          break
        }
      }
      if (isGroupPossible == true && DCareCount < MAX_DCARE_COUNT) {
        let a, b, c, d
        let result
        a = `*`
        b = `*`
        if (GROUP_SUBSTRING_2BIT[col1].charAt(0) == GROUP_SUBSTRING_2BIT[col2].charAt(0)) {
          c = GROUP_SUBSTRING_2BIT[col1].charAt(0)
          d = `*`
        }
        else {
          c = `*`
          d = GROUP_SUBSTRING_2BIT[col1].charAt(1)
        }
        result = `${a}${b}${c}${d}`
        groupList.push(result)
        groupCount++
      }
    }
  }
  const find2n4Group = (map, groupList) => {
    const MAX_DCARE_COUNT = 8
    let isGroupPossible
    let row1, row2
    // 2 * 4 형태 4가지 검사
    for (let i = 0; i < rowMaxCount; i++) {
      row1 = i
      row2 = (i + 1) % rowMaxCount
      isGroupPossible = true
      let DCareCount = 0
      for (let j = 0; j < columnMaxCount; j++) {
        if (map[row1][j] === MARK_DCARE) {
          DCareCount++
        }
        if (map[row2][j] === MARK_DCARE) {
          DCareCount++
        }
        if (map[row1][j] === MARK_FALSE || map[row2][j] === MARK_FALSE) {
          isGroupPossible = false
          break
        }
      }
      if (isGroupPossible == true && DCareCount < MAX_DCARE_COUNT) {
        let a, b, c, d
        let result
        switch (degreeInput) {
          case 3:
            a = `*`
            b = `*`
            c = `*`
            result = `${a}${b}${c}`
            break;
          case 4:
            if (GROUP_SUBSTRING_2BIT[row1].charAt(0) == GROUP_SUBSTRING_2BIT[row2].charAt(0)) {
              a = GROUP_SUBSTRING_2BIT[row1].charAt(0)
              b = `*`
            }
            else {
              a = `*`
              b = GROUP_SUBSTRING_2BIT[row1].charAt(1)
            }
            c = `*`
            d = `*`
            result = `${a}${b}${c}${d}`
            break;
          default:
            break;
        }
        groupList.push(result)
        groupCount++
      }
    }
  }
  const find16CellGroup = (map, groupList) => {
    if (columnMaxCount >= 4 && rowMaxCount >= 4) {
      find4n4Group(map, groupList)
    }
  }
  const find4n4Group = (map, groupList) => {
    const MAX_CELL_COUNT = 16
    let trueCount = 0
    let DCareCount = 0
    for (let i = 0; i < rowMaxCount; i++) {
      for (let j = 0; j < columnMaxCount; j++) {
        if (map[i][j] === MARK_DCARE) {
          DCareCount++
        }
        if (map[i][j] === MARK_TRUE || map[i][j] === MARK_DCARE) {
          trueCount++
        }
      }
    }
    if (trueCount === MAX_CELL_COUNT) {
      let a, b, c, d
      if (DCareCount < MAX_CELL_COUNT) {
        a = `*`
        b = `*`
        c = `*`
        d = `*`
        const result = `${a}${b}${c}${d}`
        groupList.push(result)
        groupCount++
      }
    }
  }
  const markCellInMap = (map, group) => {
    let row, col
    // 변수 AB로 행 번호 선택
    switch (degreeInput) {
      case 2:
        if (group.charAt(0) === MARK_FALSE) {
          row = 0
        }
        else {
          row = 1
        }
        // 변수 CD로 행 번호 선택
        if (group.charAt(1) === MARK_FALSE) {
          col = 0
        }
        else {
          col = 1
        }
        break;
      case 3:
        if (group.charAt(0) === MARK_FALSE) {
          row = 0
        }
        else {
          row = 1
        }
        // 변수 CD로 행 번호 선택
        if (group.charAt(1) === MARK_FALSE) {
          if (group.charAt(2) === MARK_FALSE) {
            col = 0
          }
          else {
            col = 1
          }
        }
        else {
          if (group.charAt(2) === MARK_FALSE) {
            col = 3
          }
          else {
            col = 2
          }
        }
        break;
      case 4:
        if (group.charAt(0) === MARK_FALSE) {
          if (group.charAt(1) === MARK_FALSE) {
            row = 0
          }
          else {
            row = 1
          }
        }
        else {
          if (group.charAt(1) === MARK_FALSE) {
            row = 3
          }
          else {
            row = 2
          }
        }
        // 변수 CD로 행 번호 선택
        if (group.charAt(2) === MARK_FALSE) {
          if (group.charAt(3) === MARK_FALSE) {
            col = 0
          }
          else {
            col = 1
          }
        }
        else {
          if (group.charAt(3) === MARK_FALSE) {
            col = 3
          }
          else {
            col = 2
          }
        }
        break;
      default:
        break;
    }
    map[row][col] = `1`
  }
  const markStringInMap = (map, str) => {
    // 그룹 문자열 확장에 의해 최대 16개의 그룹 문자열이 생성될 수 있음
    let strList = []
    let count = 1, current = 0, position
    strList.push(str)
    // 문자열 확장
    while (count > current) {
      position = strList[current].indexOf(`*`)
      // 확장 가능한 경우, 즉 `*`를 가지는 경우
      if (position !== -1) {
        // `*`를 `0`으로 바꿔 기존 문자열 수정
        const origin = strList[current]
        strList[current] = origin.replace(`*`, `0`)
        strList[count] = origin.replace(`*`, `1`)
        count++
      }
      else {
        current++
      }
    }
    for (let i = 0; i < count; i++) {
      markCellInMap(map, strList[i])
    }
  }
  const includedAlready = (map1, map2) => {
    // map1이 map2를 포함하고 있는지의 여부를 반환
    let included = 1
    for (let i = 0; i < rowMaxCount; i++) {
      for (let j = 0; j < columnMaxCount; j++) {
        if (map1[i][j] === MARK_FALSE && map2[i][j] === MARK_TRUE) {
          included = 0
        }
      }
    }
    return included
  }
  const initMap = (map) => {
    for (let i = 0; i < rowMaxCount; i++) {
      map[i] = []
      for (let j = 0; j < columnMaxCount; j++) {
        map[i].push(`0`)
      }
    }
  }
  const selectSubset = (listOld, map, countOld, listNew) => {
    // listOld: M, listNew: L
    let countNew = 0
    let includePosition = countOld - 1
    let mapL = [], mapS = []
    let S
    initMap(mapL)
    initMap(mapS)
    // 간략화된 문자열 집합 L이 Map을 포함할 때까지 반복
    while (includedAlready(mapL, map) == 0) {
      S = listOld[includePosition]
      initMap(mapS)
      // 그룹 문자열 S로 맵 mapS 생성
      markStringInMap(mapS, S)
      // 그룹 문자열 s가 간략화된 그룹 문자열 집합 L에 포함되지 않는 경우
      // S를 L에 추가
      if (includedAlready(mapL, mapS) == 0) {
        markStringInMap(mapL, S)
        listNew[countNew] = S
        countNew++
      }
      includePosition--
    }
    return countNew
  }
  const isAllDuplicate = (str) => {
    let result = true
    for (let char of str) {
      if (char !== `*`) {
        result = false
      }
    }
    return result
  }
  const getEquation = (list, count) => {
    let result
    switch (degreeInput) {
      case 2:
        result = `f(A, B) = `
        break;
      case 3:
        result = `f(A, B, C) = `
        break;
      case 4:
        result = `f(A, B, C, D) = `
        break;
      default:
        break;
    }
    if (list.length === 0) {
      result += `0`
    }
    else if (list.length === 1 && isAllDuplicate(list[0])) {
      result += `1`
    }
    else {
      const CHARCODE_A = 65
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < degreeInput; j++) {
          switch (list[i][j]) {
            case `0`:
              result += `${String.fromCharCode(CHARCODE_A + j)}'`
              break
            case `1`:
              result += `${String.fromCharCode(CHARCODE_A + j)}`
              break
            case `*`:
              break
            default:
              break
          }
        }
        if (i != count - 1) {
          result += ` + `
        }
      }
    }
    return result
  }
  const init = () => {
    const input = document.getElementById(`degree`)
    input.min = MIN_DEGREE
    input.max = MAX_DEGREE
    degreeInput = 4
    input.value = degreeInput
    createMap(degreeInput)
  }
  init()
}