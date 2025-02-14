export interface IMenu {
  label: string;
  route?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}
