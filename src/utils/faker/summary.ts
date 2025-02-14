import {
  Adjustment,
  IPreviewSummaryReportData,
  IPreviewReportScheduleDetail,
  IPreviewReportTotals,
  ISummaryAdjustmentData,
  ISummaryData,
} from "@/types/data";
import { ISuccessResponse } from "@/types/network";
import { AdjustmentType } from "@/utils/enumeration";
import { faker, fakerID_ID } from "@faker-js/faker";
import dayjs from "dayjs";

export function generateSummaryListData(rows: number): ISuccessResponse<
  ISummaryData[]
> & {
  all_brands: string[];
  all_statuses: string[];
  all_locations: { id: string; name: string }[];
} {
  const result = Array.from({ length: rows }, () => ({
    location_name: faker.helpers.arrayElement([
      "Display Wall 1",
      "Display Wall 2",
    ]),
    brand_code: faker.helpers.arrayElement(["DRG", "SPY", "PSM", "JUICE"]),
    item_code: faker.string.alpha({ length: 5, casing: "upper" }),
    freeze_qty: faker.number.int({ min: 0, max: 1000 }),
    freeze_amount: faker.number.int({ min: 0, max: 1000000 }),
    scan_qty: faker.number.int({ min: 0, max: 1000 }),
    scan_amount: faker.number.int({ min: 0, max: 1000000 }),
    difference: faker.number.int({ min: 0, max: 1000 }),
    difference_amount: faker.number.int({ min: 0, max: 1000000 }),
    status: faker.helpers.arrayElement(["equal", "minus", "plus"]),
    is_reviewed: faker.datatype.boolean(),
  }));

  return {
    data: result,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: 10,
      to: 10,
      total: result.length,
    },
    all_brands: generateBrandData(),
    all_statuses: generateStatuses(),
    all_locations: generateLocations(10),
  };
}

function generateBrandData(): string[] {
  return faker.helpers.arrayElements([
    "DRG",
    "CHI",
    "GAB",
    "INS",
    "JEC",
    "LIV",
    "SPY",
    "SOG",
    "VOX",
    "PSC",
    "NFR",
    "RCL",
  ]);
}

function generateStatuses(): string[] {
  return faker.helpers.arrayElements(["equal", "minus", "plus"]);
}

function generateLocations(rows: number): { id: string; name: string }[] {
  return Array.from({ length: rows }, () => ({
    id: faker.string.uuid(),
    name: faker.location.city(),
  }));
}

export function generateLocationData(rows: number) {
  return Array.from({ length: rows }, () => ({
    location: faker.location.city(),
    uuid: faker.string.uuid(),
  }));
}

export function generateAdjustmentData(
  adjustmentRows: number,
): ISummaryAdjustmentData {
  const generateAdjustmentData = (adjustmentRows: number): Adjustment[] => {
    return Array.from({ length: adjustmentRows }, () => ({
      id: faker.string.uuid(),
      reason: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      item_photo: faker.image.url(),
      qty: faker.number.int({ min: 0, max: 1000 }),

      user: {
        id: faker.string.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        employee_id: faker.string.uuid(),
      },
      adjustment_type: faker.helpers.arrayElement(
        Object.values(AdjustmentType),
      ),
    }));
  };
  return {
    id: faker.string.uuid(),
    is_reviewed: faker.datatype.boolean(),
    reviewer: {
      id: faker.string.uuid(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      employee_id: faker.string.uuid(),
    },
    adjustments: generateAdjustmentData(adjustmentRows),
    total_adjustments: faker.number.int({ min: 0, max: 1000 }),
    total_qty: faker.number.int({ min: 0, max: 1000 }),
  };
}

export function generateReportPreviewData(rows: number): ISuccessResponse<
  IPreviewSummaryReportData[]
> & {
  schedule_detail: IPreviewReportScheduleDetail;
  total: IPreviewReportTotals;
} {
  const data = Array.from({ length: rows }, () => ({
    brand_code: faker.finance.amount({ min: 0, max: 100000 }),
    freeze_qty: faker.number.int({ min: 0, max: 1000 }),
    freeze_amount: faker.number.int({ min: 0, max: 10000 }),
    scan_qty: faker.number.int({ min: 0, max: 1000 }),
    scan_amount: faker.number.int({ min: 0, max: 1000 }),
    difference: faker.number.int({ min: 0, max: 1000 }),
    difference_amount: faker.number.int({ min: 0, max: 1000 }),
  }));

  return {
    data: data,
    schedule_detail: generateScheduleDetail(),
    total: {
      difference: faker.number.int({ min: 0, max: 1000 }),
      difference_amount: faker.number.int({ min: 0, max: 100000 }),
      scan_qty: faker.number.int({ min: 0, max: 1000 }),
      scan_amount: faker.number.int({ min: 0, max: 100000 }),
      freeze_qty: faker.number.int({ min: 0, max: 1000 }),
      freeze_amount: faker.number.int({ min: 0, max: 100000 }),
    },
  };
}

export function generateScheduleDetail(): IPreviewReportScheduleDetail {
  return {
    id: faker.string.uuid(),
    store_code: faker.string.alpha({ length: 5, casing: "upper" }),
    store_city: faker.location.city(),
    start_date: dayjs(faker.date.past()).format("YYYY-MM-DD"),
    end_date: dayjs(faker.date.past()).format("YYYY-MM-DD"),
    status: faker.helpers.arrayElement(["in_progress", "scheduled"]),
    finalize_data: {
      created_at: dayjs(faker.date.past()).format("YYYY-MM-DD"),
      user: {
        id: faker.string.uuid(),
        name: faker.person.firstName() + " " + faker.person.lastName(),
        email: faker.internet.email(),
        employee_id: faker.string.alpha({ length: 5, casing: "upper" }),
      },
    },
    total_qty: faker.number.int({ min: 0, max: 1000 }),
    assignees: Array.from({ length: 5 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.firstName() + " " + faker.person.lastName(),
      email: faker.internet.email(),
      employee_id: faker.string.alpha({ length: 5, casing: "upper" }),
    })),
    area_manager: fakerID_ID.person.fullName(),
    senior_store_head: fakerID_ID.person.fullName(),
    week: faker.number.int({ min: 1, max: 52 }),
    freeze_group: {
      id: faker.string.uuid(),
      created_at: dayjs(faker.date.past()).format("YYYY-MM-DD"),
      total_qty: faker.number.int({ min: 0, max: 1000 }),
      total_amount: faker.number.int({ min: 0, max: 1000000 }),
      user: {
        id: faker.string.uuid(),
        name: faker.person.firstName() + " " + faker.person.lastName(),
        is_active: faker.datatype.boolean(),
        employee_id: faker.string.alpha({ length: 5, casing: "upper" }),
      },
    },
  };
}
