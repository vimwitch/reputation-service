import { Web2Provider } from "@interrep/reputation-criteria"
import { Session } from "next-auth"

const mockSession: Session = {
    web2Provider: Web2Provider.TWITTER,
    expires: "123",
    web2AccountId: "6087dabb0b3af8703a581bef",
    user: { id: "12", name: "Joe" }
}

export default mockSession
