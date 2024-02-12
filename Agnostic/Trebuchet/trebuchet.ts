import * as fs from "fs";

const filePath: string = "./input.txt";

const numberRegex: RegExp =
  /\d+|\b(zero|one|two|three|four|five|six|seven|eight|nine)\b/gi;

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  const calibrationArray = data.split("\n");
  const calibrationSum = calculateCalibrationSum(calibrationArray);

  console.log("Calibration output sum: " + calibrationSum);
});

function calculateCalibrationSum(calibrationArray: string[]): number {
  let calibrationSum: number = 0;
  calibrationArray.map((calibrationLine) => {
    let numArray: RegExpMatchArray | null = calibrationLine.match(numberRegex);
    if (numArray === null) return;

    const eachDigitArr = numArray.flatMap((num) => num.split(""));

    const firstDigit = eachDigitArr[0];
    const lastDigit = eachDigitArr[eachDigitArr.length - 1];

    calibrationSum += Number(firstDigit + lastDigit);
  });
  return calibrationSum;
}
