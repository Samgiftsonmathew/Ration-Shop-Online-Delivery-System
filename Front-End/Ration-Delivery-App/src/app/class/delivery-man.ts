export class Region {
  constructor(public id?: number) {}
}

export class DeliveryMan {
  constructor(
    public aadharNum: number,
    public name: string,
    public phoneNO: number,
    public region: Region,
    public id?: number
  ) {}
}
export class DeliveryOrder {
  constructor(
    public orderId: number,
    public status: string,
    public regionId: number,
    public customerName: string,
    public address: string,
    public phNo: number
  ) {}
}