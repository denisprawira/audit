import * as Yup from "yup";
export const remarkValidationSchema = Yup.object().shape({
  remark: Yup.string()
    .required("Remark cannot be empty")
    .min(8, "Remark must be at least 8 characters"),
});
