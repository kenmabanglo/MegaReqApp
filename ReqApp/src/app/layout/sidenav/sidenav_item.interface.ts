export interface IMenu {
  name?: any;
  url?: string;
  icon?: string;
  color?: string;
  role?: string;
  children?: IMenuItem[];
}

export interface IMenuItem {
  name?: any;
  url?: string;
  icon?: string;
  color?:string;
  role?: string;
}