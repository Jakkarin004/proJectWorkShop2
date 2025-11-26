export const API_PATHS = {
  getData: 'http://localhost:8778/Tahn-controller/get-data',
  saveData: 'http://localhost:8778/Tahn-controller/save-data',
  findData: 'http://localhost:8778/Tahn-controller/get-data-find-user',
  updateUser: (id: string | number) => `http://localhost:8778/Tahn-controller/users/${id}`,
  deleteData: (id: string | number) => `http://localhost:8778/Tahn-controller/delete/${id}`,
};
