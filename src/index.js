import factory from "./ComplaintImageFactory";
import multipleImageFactory from "./MultipleComplaintImageFactory";
import DefaultComplaintText from "./DefaultComplaintText";
import DefaultSelectImages from "./DefaultSelectImages";
import SelectMultipleImages from "./SelectMultipleImages";

export function complaintImageFactory(
  ComplaintText = DefaultComplaintText,
  SelectImages = DefaultSelectImages
) {
  return factory(ComplaintText, SelectImages);
}

export function multipleComplaintImageFactory(
  ComplaintText = DefaultComplaintText,
  SelectImages = SelectMultipleImages
) {
  return multipleImageFactory(ComplaintText, SelectImages);
}

export default {
  complaintImageFactory,
  multipleComplaintImageFactory,
};
