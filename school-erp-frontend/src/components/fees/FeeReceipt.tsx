"use client";

export default function FeeReceipt({ fee }: { fee: any }) {
    const totalAmount = Number(fee.totalAmount || 0);
    const paidAmount = Number(fee.paidAmount || 0);
    const due = Math.max(0, totalAmount - paidAmount);

    const formatDate = (value: string) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString("en-IN");
    };

    const onPrint = () => {
        const printWindow = window.open("", "_blank", "width=900,height=700");
        if (!printWindow) return;

        const receiptHtml = `
        <html>
          <head>
            <title>Fee Receipt</title>
            <style>
              * {
                box-sizing: border-box;
              }

              body {
                margin: 0;
                padding: 24px;
                font-family: Arial, Helvetica, sans-serif;
                background: #f8fafc;
                color: #0f172a;
              }

              .receipt {
                max-width: 820px;
                margin: 0 auto;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 18px;
                overflow: hidden;
              }

              .header {
                background: linear-gradient(to right, #0f172a, #334155);
                color: white;
                padding: 24px 28px;
              }

              .school-name {
                font-size: 26px;
                font-weight: 700;
                letter-spacing: 0.2px;
              }

              .school-subtitle {
                margin-top: 6px;
                font-size: 13px;
                opacity: 0.9;
              }

              .body {
                padding: 28px;
              }

              .top-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 18px;
                margin-bottom: 24px;
              }

              .receipt-title {
                font-size: 22px;
                font-weight: 700;
                margin: 0 0 8px;
              }

              .meta {
                font-size: 14px;
                color: #475569;
                line-height: 1.7;
              }

              .status-badge {
                padding: 9px 14px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 700;
                border: 1px solid;
                white-space: nowrap;
              }

              .paid {
                background: #ecfdf5;
                color: #047857;
                border-color: #a7f3d0;
              }

              .partial {
                background: #fff7ed;
                color: #c2410c;
                border-color: #fdba74;
              }

              .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-bottom: 22px;
              }

              .field {
                border: 1px solid #e2e8f0;
                border-radius: 14px;
                padding: 14px 16px;
                background: #f8fafc;
              }

              .label {
                font-size: 12px;
                color: #64748b;
                margin-bottom: 6px;
              }

              .value {
                font-size: 15px;
                font-weight: 600;
                color: #0f172a;
                word-break: break-word;
              }

              .amount-box {
                border: 1px solid #e2e8f0;
                border-radius: 14px;
                overflow: hidden;
                margin-top: 6px;
              }

              .amount-header {
                padding: 14px 16px;
                font-size: 15px;
                font-weight: 700;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
              }

              .amount-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 16px;
                border-bottom: 1px solid #e2e8f0;
                font-size: 15px;
              }

              .amount-row:last-child {
                border-bottom: none;
              }

              .amount-row.total {
                background: #f8fafc;
                font-weight: 700;
              }

              .amount-row.paid-amt strong {
                color: #047857;
              }

              .amount-row.due-amt strong {
                color: #b91c1c;
              }

              .footer {
                margin-top: 30px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                gap: 24px;
              }

              .note-box {
                flex: 1;
                border: 1px dashed #cbd5e1;
                border-radius: 14px;
                padding: 14px 16px;
                background: #f8fafc;
              }

              .note-title {
                font-size: 13px;
                font-weight: 700;
                margin-bottom: 6px;
                color: #334155;
              }

              .note-text {
                font-size: 12px;
                color: #64748b;
                line-height: 1.7;
              }

              .signature {
                width: 220px;
                text-align: center;
              }

              .signature-space {
                height: 60px;
              }

              .signature-line {
                border-top: 1px solid #334155;
                padding-top: 8px;
                font-size: 13px;
                color: #334155;
                font-weight: 600;
              }

              @media print {
                body {
                  background: white;
                  padding: 0;
                }

                .receipt {
                  max-width: 100%;
                  border: none;
                  border-radius: 0;
                }

                @page {
                  size: A4 portrait;
                  margin: 10mm;
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="school-name">God Father International School</div>
                <div class="school-subtitle">Official Student Fee Payment Receipt</div>
              </div>

              <div class="body">
                <div class="top-row">
                  <div>
                    <div class="receipt-title">Fee Receipt</div>
                    <div class="meta">
                      <div><strong>Receipt No:</strong> ${fee.receiptNo || "-"}</div>
                      <div><strong>Payment Date:</strong> ${formatDate(fee.paymentDate)}</div>
                    </div>
                  </div>

                  <div class="status-badge ${due === 0 ? "paid" : "partial"}">
                    ${due === 0 ? "PAID" : "PARTIAL / DUE"}
                  </div>
                </div>

                <div class="grid">
                  <div class="field">
                    <div class="label">Student Name</div>
                    <div class="value">${fee.studentId?.userId?.name || "-"}</div>
                  </div>

                  <div class="field">
                    <div class="label">Student Email</div>
                    <div class="value">${fee.studentId?.userId?.email || "-"}</div>
                  </div>

                  <div class="field">
                    <div class="label">Class</div>
                    <div class="value">${fee.classId?.className || "-"} ${fee.classId?.section || ""}</div>
                  </div>

                  <div class="field">
                    <div class="label">Month / Fee Period</div>
                    <div class="value">${fee.month || "-"}</div>
                  </div>
                </div>

                <div class="amount-box">
                  <div class="amount-header">Payment Summary</div>

                  <div class="amount-row">
                    <span>Total Amount</span>
                    <strong>₹${totalAmount}</strong>
                  </div>

                  <div class="amount-row paid-amt">
                    <span>Paid Amount</span>
                    <strong>₹${paidAmount}</strong>
                  </div>

                  <div class="amount-row total due-amt">
                    <span>Due Amount</span>
                    <strong>₹${due}</strong>
                  </div>
                </div>

                <div class="footer">
                  <div class="note-box">
                    <div class="note-title">Note</div>
                    <div class="note-text">
                      This is a computer-generated fee receipt issued by the school.
                      Please keep this receipt safe for future reference and verification.
                    </div>
                  </div>

                  <div class="signature">
                    <div class="signature-space"></div>
                    <div class="signature-line">Authorized Signature</div>
                  </div>
                </div>
              </div>
            </div>

            <script>
              window.onload = function () {
                window.print();
                window.onafterprint = function () {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
        `;

        printWindow.document.open();
        printWindow.document.write(receiptHtml);
        printWindow.document.close();
    };

    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-2xl font-bold text-slate-900">
                        Fee Receipt
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                        Receipt No: {fee.receiptNo || "-"}
                    </div>
                </div>

                <button
                    onClick={onPrint}
                    className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
                >
                    Print
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="text-slate-500">Student</div>
                    <div className="font-semibold text-slate-900">
                        {fee.studentId?.userId?.name || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Email</div>
                    <div className="font-semibold text-slate-900">
                        {fee.studentId?.userId?.email || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Class</div>
                    <div className="font-semibold text-slate-900">
                        {fee.classId?.className || "-"}{" "}
                        {fee.classId?.section || ""}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Month</div>
                    <div className="font-semibold text-slate-900">
                        {fee.month || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Total Amount</div>
                    <div className="font-semibold text-slate-900">
                        ₹{totalAmount}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Paid Amount</div>
                    <div className="font-semibold text-slate-900">
                        ₹{paidAmount}
                    </div>
                </div>
            </div>
        </div>
    );
}
