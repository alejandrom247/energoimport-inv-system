import { Prisma } from "@prisma/client";

export const computerInclude = {
                motherboard: true,
                monitor: true,
                cpu: true,
                ram: true,
                hdd: true,
                printer: true,
                disket: true,
                keyboard: true,
                mouse: true,
                speaker: true,
                power_supply: true,
                peripheral: true,
                ups: true,
                createdBy: {
                    select: {
                        username: true
                    }
                }
        
} satisfies Prisma.ComputerInclude