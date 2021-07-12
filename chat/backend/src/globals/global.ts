// All Global Users

// interface UserDetails {
//   id: string;
//   studentId: string;
//   fullName: string;
//   avatarUrl: string;
//   gender: string;
// }

type SocketType = {
  userSocket1: string;
  userSocket2: string;
};

export const availableUsers = new Map();
export const roomValues = new Map<string, SocketType>();
export const onlineUsers: string[] = [];
export const rooms: string[] = [];
