import "./options.css"
import { Environment } from "./model/Environment"
import { getEnvironments, saveEnvironments } from "./storage/storage"
import { ALL_HOSTS_WILDCARD } from "./config/config"
import { sleep } from "./helper/sleep"
import { EnvironmentTypeEnum } from "./model/EnvironmentTypeEnum"

const redEnvironments = document.querySelector("#red-environments") as HTMLTextAreaElement
const yellowEnvironments = document.querySelector("#yellow-environments") as HTMLTextAreaElement
const greenEnvironments = document.querySelector("#green-environments") as HTMLTextAreaElement

const saveButton = document.querySelector("#save-button") as HTMLButtonElement

function linesToArray(value?: string): string[] {
    return value?.split("\n").filter((v) => v.trim() !== "") || []
}

saveButton.addEventListener("click", async () => {
    saveButton.disabled = true

    const redPatterns = linesToArray(redEnvironments.value)
    const yellowPatterns = linesToArray(yellowEnvironments.value)
    const greenPatterns = linesToArray(greenEnvironments.value)

    const environments = [
        ...redPatterns.map((pattern) =>
            Environment.fromObject({
                pattern,
                type: EnvironmentTypeEnum.Red,
            })
        ),
        ...yellowPatterns.map((pattern) =>
            Environment.fromObject({
                pattern,
                type: EnvironmentTypeEnum.Yellow,
            })
        ),
        ...greenPatterns.map((pattern) =>
            Environment.fromObject({
                pattern,
                type: EnvironmentTypeEnum.Green,
            })
        ),
    ]

    await saveEnvironments(environments)

    await chrome.permissions.request({
        permissions: ["scripting"],
        origins: [ALL_HOSTS_WILDCARD],
    })

    await sleep(300)

    saveButton.disabled = false
})
;(async () => {
    const environments = await getEnvironments()

    const redPatterns = []
    const yellowPatterns = []
    const greenPatterns = []

    for (const environment of environments) {
        if (environment.type === EnvironmentTypeEnum.Red) {
            redPatterns.push(environment.pattern)
        } else if (environment.type === EnvironmentTypeEnum.Yellow) {
            yellowPatterns.push(environment.pattern)
        } else if (environment.type === EnvironmentTypeEnum.Green) {
            greenPatterns.push(environment.pattern)
        }
    }

    redEnvironments.value = redPatterns.join("\n")
    yellowEnvironments.value = yellowPatterns.join("\n")
    greenEnvironments.value = greenPatterns.join("\n")
})()
