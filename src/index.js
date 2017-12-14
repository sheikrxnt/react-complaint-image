import factory from "./ComplaintImageFactory";
import DefaultComplaintText from "./DefaultComplaintText";
import DefaultSelectImages from "./DefaultSelectImages";

export default function(
  ComplaintText = DefaultComplaintText,
  SelectImages = DefaultSelectImages
) {
  return factory(ComplaintText, SelectImages);
}
