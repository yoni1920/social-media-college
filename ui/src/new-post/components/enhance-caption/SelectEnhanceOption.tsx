import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { EnhanceOption } from "../../enums/enhance-option.enum";

type Props = {
  onEnhanceOptionChosen: (event: SelectChangeEvent<EnhanceOption>) => void;
  enhanceOption: EnhanceOption;
};

export const SelectEnhanceOption = ({
  onEnhanceOptionChosen,
  enhanceOption,
}: Props) => {
  return (
    <Select value={enhanceOption} onChange={onEnhanceOptionChosen} size="small">
      <MenuItem value={EnhanceOption.PARAPHRASE}>Paraphrase</MenuItem>
      <MenuItem value={EnhanceOption.CONCISE}>Concise</MenuItem>
      <MenuItem value={EnhanceOption.ELABORATE}>Elaborate</MenuItem>
    </Select>
  );
};
