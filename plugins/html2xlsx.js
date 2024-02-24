import * as XLSX from 'xlsx';
export default function (ctx, inject) {
    inject("htmlToXlsx", htmlToXlsx);
}

function htmlToXlsx(html, filename) {
  const table = document.createElement('table');
  table.innerHTML = html;
  const wb = XLSX.utils.table_to_book(table, { sheet: 'SheetJS' });
  XLSX.writeFile(wb, filename + '.xlsx');
}