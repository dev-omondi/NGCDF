import ExcelJS from "exceljs";
import Applications from "../models/applicationSchema.js";

export const downloadApprovedApplicants = async (req, res) => {
  
console.log("Cycle Name:", req.query.cycleName);
  try {
    const {
      cycleName
    } = req.query;

    // ==========================
    // BUILD QUERY
    // =====================

    const query = {
      status: "Approved",
      ApprovedAmount: { $gt: 0 },
    };

    if (cycleName) query.cycleName=cycleName;

    const applicants = await Applications.find(query).sort({
      institutionName: 1,
      fullName: 1,
    });

    if (!applicants.length) {
      return res.status(404).json({
        success: false,
        message: "No approved applicants found.",
      });
    }

    const MAX_PER_SHEET = 300;
      const sheets = [];

    let currentSheet = [];

    for (const applicant of applicants) {
      if (currentSheet.length < MAX_PER_SHEET) {
        currentSheet.push(applicant);
        continue;
      }

      const lastApplicant = currentSheet[currentSheet.length - 1];

      if (lastApplicant.institutionName === applicant.institutionName) {
        currentSheet.push(applicant);
      } else {
        sheets.push(currentSheet);
        currentSheet = [applicant];
      }
    }

    if (currentSheet.length) {
      sheets.push(currentSheet);
    }
    
    //@.... CREATE WORKBOOK
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Muhoroni NGCDF";
    workbook.company = "Muhoroni NGCDF";
    workbook.created = new Date();

     let grandTotal = 0;
    let grandBeneficiaries = 0

    for (let i = 0; i < sheets.length; i++) {

        const worksheet = workbook.addWorksheet(
            `Bank Schedule ${i + 1}`
        );

    const sheetApplicants = sheets[i];

    // COLUMN WIDTH

    worksheet.columns = [
      { key: "no", width: 8 },
      { key: "name", width: 35 },
      { key: "admission", width: 20 },
      { key: "grade", width: 18 },
      { key: "year", width: 18 },
      { key: "amount", width: 20 },
    ];

    // ==========================
    // REPORT HEADER
    // ==========================

    worksheet.mergeCells("A1:F1");

    worksheet.getCell("A1").value =
      "MUHORONI NATIONAL GOVERNMENT CONSTITUENCIES DEVELOPMENT FUND";

    worksheet.getCell("A1").font = {
      bold: true,
      size: 16,
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
    };

    worksheet.mergeCells("A2:F2");

    worksheet.getCell("A2").value =
      "BURSARY BANK PAYMENT SCHEDULE";

    worksheet.getCell("A2").font = {
      bold: true,
      size: 14,
    };

    worksheet.getCell("A2").alignment = {
      horizontal: "center",
    };

    worksheet.mergeCells("A4:F4");
    worksheet.getCell("A4").value = `Cycle Name: ${cycleName || "All"}`;
    worksheet.getCell("A4").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.mergeCells("A5:F5");
    worksheet.getCell("A5").value = `Generated On: ${new Date().toLocaleDateString()}`;
    worksheet.getCell("A5").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
     
    
    // GROUP BY INSTITUTION
  

    const groupedApplicants = sheetApplicants.reduce((groups, applicant) => {

      if (!groups[applicant.institutionName]) {
        groups[applicant.institutionName] = [];
      }

      groups[applicant.institutionName].push(applicant);

      return groups;

    }, {});

    let currentRow = 7;


    // LOOP INSTITUTIONS

    for (const institution of Object.keys(groupedApplicants)) {

      const students = groupedApplicants[institution];

      // Blank Row

      worksheet.addRow([]);

      currentRow++;

      // Institution Heading

      worksheet.mergeCells(`A${currentRow}:F${currentRow}`);

      const institutionCell =
        worksheet.getCell(`A${currentRow}`);

      institutionCell.value = institution;

      institutionCell.font = {
        bold: true,
        size: 13,
      };

      institutionCell.alignment = {
        horizontal: "center",
      };

      currentRow++;

      // ==========================
      // TABLE HEADER
      // ==========================

      const header = worksheet.getRow(currentRow);

      header.values = [
        "No",
        "Applicant Name",
        "Admission No",
        "Grade/Form",
        "Year Of Study",
        "Amount (KES)",
      ];


      header.alignment = {
        horizontal: "center",
      };
    
       currentRow++;

      let institutionTotal = 0;
    
      // STUDENTS

      students.forEach((student, index) => {

        const row = worksheet.getRow(currentRow);

        row.values = [
          index + 1,
          student.fullName,
          student.admissionNo,
          student.levelOfStudy === "Secondary"
            ? student.class
            : "",
          student.levelOfStudy !== "Secondary"
            ? student.yearOfStudy
            : "",
          student.ApprovedAmount,
        ];

        row.getCell(6).numFmt = "#,##0";

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        institutionTotal += student.ApprovedAmount;

        grandTotal += student.ApprovedAmount;

        grandBeneficiaries++;

        currentRow++;

      });

      // ==========================
      // INSTITUTION TOTAL
      // ==========================

      const beneficiaryRow = worksheet.getRow(currentRow);

      beneficiaryRow.values = [
        "",
        "",
        "",
        "",
        "Beneficiaries",
        students.length,
      ];

      beneficiaryRow.font = {
        bold: true,
      };

      currentRow++;

      const totalRow = worksheet.getRow(currentRow);

      totalRow.values = [
        "",
        "",
        "",
        "",
        "Institution Total",
        institutionTotal,
      ];

      totalRow.font = {
        bold: true,
      };

      totalRow.getCell(6).numFmt = "#,##0";

      currentRow += 2;
    }

    // ==========================
    // GRAND TOTAL
    // ==========================

    const beneficiariesRow = worksheet.getRow(currentRow);

    beneficiariesRow.values = [
      "",
      "",
      "",
      "",
      "TOTAL BENEFICIARIES",
      grandBeneficiaries,
    ];

    beneficiariesRow.font = {
      bold: true,
      size: 12,
    };

    currentRow++;

    const grandRow = worksheet.getRow(currentRow);

    grandRow.values = [
      "",
      "",
      "",
      "",
      "GRAND TOTAL",
      grandTotal,
    ];

    grandRow.font = {
      bold: true,
      size: 12,
    };

    grandRow.getCell(6).numFmt = "#,##0";

    currentRow += 3;

    // ==========================
    // SIGNATURES
    // ==========================

    worksheet.getCell(`A${currentRow}`).value =
      "Prepared By:";

    worksheet.getCell(`C${currentRow}`).value =
      "________________________";

    currentRow += 2;

    worksheet.getCell(`A${currentRow}`).value =
      "Approved By:";

    worksheet.getCell(`C${currentRow}`).value =
      "________________________";

    currentRow += 2;

    worksheet.getCell(`A${currentRow}`).value =
      "Official Stamp:";

    worksheet.getCell(`C${currentRow}`).value =
      "________________________";

        }
      

    // ==========================
    // DOWNLOAD
    // ==========================

    const fileName = `Bank_Schedule_${cycleName}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}`
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate bank schedule.",
      error: error.message,
    });

  }
};