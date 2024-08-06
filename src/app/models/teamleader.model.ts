
// export interface TeamLeader {

import { users } from "./user.model";

//     Teamleader_Name: string;
//     shift: string;
//     AreaID: string;
//     UserID: string;
//     ProjectID: string;
//     CommentOnDelete: boolean;

//   }


  export interface TeamLeader {
    id: number;
    teamleader_Name: string;
    n_User: users[];
    userID: number[];

    n_Project: any;
    n_Area: any;
    shift: string;
    CommenterDelete: boolean;

    users: users[];
  }