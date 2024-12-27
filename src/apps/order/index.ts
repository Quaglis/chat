import orderSocket from "./order-socket"
import orderController from "./order-controller"


export default () => {
    orderSocket()
    orderController()
}