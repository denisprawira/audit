export default interface MenuItem {
  title: string;
  link?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}
