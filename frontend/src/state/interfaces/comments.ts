export interface IComment {
  comments     : Comment[];
  totalComments: number;
}

export interface Comment {
  parentId?: string;
  id       : string;
  content  : string;
  date     : string;
  user     : User;
  responses: Comment[];
}

interface User {
  id       : string;
  firstName: string;
  lastName : string;
  username : string;
  avatar   : string;
}
