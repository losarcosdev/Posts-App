export interface Post {
  likes        : Like[];
  likeCount    : number;
  id           : string;
  slug         : string;
  tag          : string;
  title        : string;
  comments     : number;
  user         : User;
  description? : string;
}

interface Like {
  id: string;
}

export interface User {
  avatar   : string;
  firstName: string;
  id       : string;
  lastName : string;
  username : string;
}

