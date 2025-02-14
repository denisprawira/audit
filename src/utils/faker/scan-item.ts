import { IScanItemDetail, IScanData, ICommentData } from "@/types/data/index";
import { faker } from "@faker-js/faker";
import { ISuccessResponse } from "@/types/network/Response";

export function generateScanItemData(
  rows: number,
): ISuccessResponse<IScanData[]> {
  const data: IScanData[] = Array.from({ length: rows }, () => ({
    name: faker.string.alpha({ length: 5, casing: "upper" }),
    background_image: faker.image.url(),
    id: faker.string.uuid(),
    total_qty: faker.number.int({ min: 0, max: 1000 }),
    user: {
      email: faker.internet.email(),
      employee_id: faker.string.uuid(),
      id: faker.string.uuid(),
      name: faker.person.firstName() + " " + faker.person.lastName(),
    },
  }));

  return {
    data: data,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: 10,
      to: 10,
      total: data.length,
    },
  };
}

export function generateScanItemDetailsData(rows: number): ISuccessResponse<
  IScanItemDetail[]
> & {
  brand_codes: string[];
  notes: ICommentData;
} {
  const data: IScanItemDetail[] = Array.from({ length: rows }, () => ({
    barcode: faker.string.alpha({ length: 8, casing: "upper" }),
    brand_code: faker.helpers.arrayElement(["DRG", "SPY", "PSM", "JUICE"]),
    per_item_price: faker.number.int({ min: 0, max: 1000 }),
    qty: faker.number.int({ min: 0, max: 1000 }),
    amount: faker.number.int({ min: 0, max: 1000 }),
    item_code: faker.string.alpha({ length: 5, casing: "upper" }),
  }));

  return {
    data: data,
    brand_codes: ["DRG", "SPY", "PSM", "JUICE"],
    notes: {
      comment: faker.lorem.sentence(),
      comment_image: faker.image.url(),
      scanned_at: faker.date.past().toISOString(),
      user: {
        name: faker.person.firstName() + " " + faker.person.lastName(),
        email: faker.internet.email(),
        employee_id: faker.string.alpha({ length: 5, casing: "upper" }),
        id: faker.string.uuid(),
      },
    },
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: 10,
      to: 10,
      total: data.length,
    },
  };
}
