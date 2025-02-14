import { FreezeGroup, IDocumentFreeze, IFreezeData } from "@/types/data/index";
import { faker } from "@faker-js/faker";
import { ISuccessResponse } from "@/types/network/Response";
import dayjs from "dayjs";

export function generateFreezeData(rows: number): ISuccessResponse<
  IFreezeData[]
> & {
  brand_codes: string[];
  freeze_group: FreezeGroup;
} {
  const freezeData: IFreezeData[] = Array.from({ length: rows }, () => {
    const qty = faker.number.int({ min: 1, max: 1000 });
    const per_item_price = faker.number.int({ min: 100, max: 100000 });
    const amount_price = qty * per_item_price;
    return {
      brand_code: faker.string.alpha({ length: 5, casing: "upper" }),
      item_code: faker.string.alpha({ length: 5, casing: "upper" }),
      barcode: faker.string.alpha({ length: 8, casing: "upper" }),
      description: faker.lorem.sentence(),
      qty,
      per_item_price,
      amount_price,
    };
  });

  return {
    data: freezeData,
    brand_codes: Array.from(new Set(freezeData.map((item) => item.brand_code))),
    freeze_group: generateFreezeGroup(),
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: rows,
      to: rows,
      total: rows,
    },
  };
}

const generateFreezeGroup = (): FreezeGroup => ({
  id: faker.string.uuid(),
  created_at: dayjs(faker.date.past()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  total_qty: faker.number.int({ min: 0, max: 1000 }),
  total_amount: faker.number.int({ min: 0, max: 1000000 }),
  user: {
    id: faker.string.uuid(),
    name: faker.person.firstName() + " " + faker.person.lastName(),
    is_active: faker.datatype.boolean(),
    employee_id: faker.string.alpha({ length: 5, casing: "upper" }),
  },
});

export const generateListDocumentFreeze = (row = 5): IDocumentFreeze[] => {
  return Array.from({ length: row }, () => {
    const id = faker.number.int({ min: 1, max: 10000 });
    const total_items = faker.number.int({ min: 0, max: 1000 });
    const doctype = faker.helpers.arrayElement(["Invoice", "Receipt", "Order"]);
    const freezedate = dayjs(faker.date.past()).format("YYYY-MM-DD");
    const store = {
      code: faker.string.alpha({ length: 5, casing: "upper" }),
      city: faker.location.city(),
    };

    return {
      id,
      total_items,
      doctype,
      freezedate,
      store,
      code: store.code,
      city: store.city,
    };
  });
};
