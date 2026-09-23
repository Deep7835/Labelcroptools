// Every article registers itself here. Order does not matter; the build sorts by date.
import meeshoLabels from './meesho-label-cropping-without-invoice.mjs';
import meeshoRto from './meesho-rto-returns-cost.mjs';
import meeshoPayments from './meesho-payment-statement.mjs';
import meeshoImages from './meesho-catalog-image-rejection.mjs';
import meeshoPacking from './meesho-parcel-packing-checklist.mjs';

import flipkartPrinting from './flipkart-thermal-vs-a4.mjs';
import flipkartSku from './flipkart-sku-fsn-organisation.mjs';
import flipkartWeight from './flipkart-volumetric-weight.mjs';
import flipkartImages from './flipkart-listing-images.mjs';
import flipkartDispatch from './flipkart-daily-dispatch-checklist.mjs';

import amazonLabels from './amazon-easy-ship-label-4x6.mjs';
import amazonFees from './amazon-fees-real-profit.mjs';
import amazonImages from './amazon-product-images.mjs';
import amazonFulfilment from './amazon-fba-vs-easy-ship.mjs';
import amazonReturns from './amazon-reduce-returns-claims.mjs';

import toolsFourUp from './print-4-labels-one-a4-sheet.mjs';
import toolsImageSize from './product-image-file-too-large.mjs';
import toolsGstPrice from './gst-inclusive-vs-exclusive.mjs';

import toolsMeeshoSort from './sort-meesho-labels-by-sku.mjs';
import toolsFlipkartInvoice from './remove-invoice-flipkart-label-pdf.mjs';
import toolsAmazonSmall from './amazon-label-printing-too-small.mjs';
import toolsMargins from './remove-white-margins-pdf.mjs';
import toolsMergeLocal from './merge-pdf-without-uploading.mjs';
import toolsSplit from './split-large-pdf-separate-files.mjs';
import toolsSideways from './pdf-pages-print-sideways.mjs';
import toolsPhotosPdf from './turn-phone-photos-into-one-pdf.mjs';
import toolsExportImages from './export-pdf-pages-as-images.mjs';
import toolsPrintTips from './label-printing-tips-online-sellers.mjs';
import toolsPickPack from './pick-and-pack-mistakes.mjs';
import toolsProfit from './profit-per-order-calculation.mjs';
import toolsVolumetric from './courier-charged-more-than-actual-weight.mjs';
import toolsBarcode from './which-barcode-type-for-products.mjs';
import toolsUpiQr from './create-upi-qr-code-for-payments.mjs';
import toolsThankYou from './thank-you-cards-online-orders.mjs';
import toolsTaxInvoice from './what-a-tax-invoice-must-contain.mjs';
import toolsWhiteBg from './white-background-product-photos.mjs';

export const posts = [
  toolsMeeshoSort, toolsFlipkartInvoice, toolsAmazonSmall, toolsMargins, toolsMergeLocal, toolsSplit, toolsSideways, toolsPhotosPdf, toolsExportImages, toolsPrintTips, toolsPickPack, toolsProfit, toolsVolumetric, toolsBarcode, toolsUpiQr, toolsThankYou, toolsTaxInvoice, toolsWhiteBg,
  toolsFourUp, toolsImageSize, toolsGstPrice,
  meeshoLabels, meeshoRto, meeshoPayments, meeshoImages, meeshoPacking,
  flipkartPrinting, flipkartSku, flipkartWeight, flipkartImages, flipkartDispatch,
  amazonLabels, amazonFees, amazonImages, amazonFulfilment, amazonReturns,
];
