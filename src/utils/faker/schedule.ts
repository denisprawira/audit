import {
  Assignee,
  FreezeGroup,
  IScheduleData,
  IScheduleOverviewData,
} from "@/types/data";
import { ISuccessResponse } from "@/types/network";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

export function generateScheduleData(
  rows: number,
): ISuccessResponse<IScheduleData[]> {
  const assignees = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.firstName() + " " + faker.person.lastName(),
    email: faker.internet.email(),
    employee_id: faker.string.alpha({ length: 5, casing: "upper" }),
  }));

  const data: IScheduleData[] = Array.from({ length: rows }, () => ({
    id: faker.string.uuid(),
    store_code: faker.string.alpha({ length: 5, casing: "upper" }),
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
    assignees: assignees,
    store_city: faker.location.city(),
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

export function generateScheduleOverviewData(): IScheduleOverviewData {
  const generateAssignees = (): Assignee[] =>
    Array.from({ length: 3 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.firstName() + " " + faker.person.lastName(),
      email: faker.internet.email(),
      employee_id: faker.string.alpha({ length: 5, casing: "upper" }),
    }));

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

  const overviewData = {
    id: faker.string.uuid(),
    store_code: faker.string.alpha({ length: 5, casing: "upper" }),
    start_date: dayjs(faker.date.past()).format("YYYY-MM-DD"),
    end_date: dayjs(faker.date.past()).format("YYYY-MM-DD"),
    status: faker.helpers.arrayElement(["in_progress", "scheduled"]),
    is_finalized: faker.datatype.boolean(),
    total_qty: faker.number.int({ min: 0, max: 1000 }),
    assignees: generateAssignees(),
    area_manager: faker.person.firstName() + " " + faker.person.lastName(),
    senior_store_head: faker.person.firstName() + " " + faker.person.lastName(),
    week: faker.number.int({ min: 1, max: 52 }),
    freeze_group: generateFreezeGroup(),
  };
  return overviewData;
}
