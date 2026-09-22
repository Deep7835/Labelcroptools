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

export const posts = [
  meeshoLabels, meeshoRto, meeshoPayments, meeshoImages, meeshoPacking,
  flipkartPrinting, flipkartSku, flipkartWeight, flipkartImages, flipkartDispatch,
  amazonLabels, amazonFees, amazonImages, amazonFulfilment, amazonReturns,
];
