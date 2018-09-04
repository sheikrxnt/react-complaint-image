import factory from "./ComplaintImageFactory";
import multipleImageFactory from "./MultipleComplaintImageFactory";
import DefaultComplaintText from "./DefaultComplaintText";
import DefaultSelectImages from "./DefaultSelectImages";

export function complaintImageFactory(
  ComplaintText = DefaultComplaintText,
  SelectImages = DefaultSelectImages
) {
  return factory(ComplaintText, SelectImages);
}

export function multipleComplaintImageFactory(
  ComplaintText = DefaultComplaintText,
  SelectImages = DefaultSelectImages
) {
  return multipleImageFactory(ComplaintText, SelectImages);
}

export default {
  complaintImageFactory,
  multipleComplaintImageFactory,
};
