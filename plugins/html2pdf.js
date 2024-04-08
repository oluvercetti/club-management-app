
import html2pdf from 'html2pdf.js';

export default function (ctx, inject) {
    inject("html2pdf", html2pdf);
}