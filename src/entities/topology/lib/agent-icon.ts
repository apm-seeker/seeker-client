import userIcon from '@/shared/assets/agent-icons/user.png'
import gatewayIcon from '@/shared/assets/agent-icons/internet.png'
import tomcatIcon from '@/shared/assets/agent-icons/tomcat.png'
import dbIcon from '@/shared/assets/agent-icons/db.png'

const TYPE_TO_ICON: Record<string, string> = {
  USER: userIcon,
  GATEWAY: gatewayIcon,
  API_GATEWAY: gatewayIcon,
  TOMCAT: tomcatIcon,
  SPRING_BOOT: tomcatIcon,
  JAVA: tomcatIcon,
  MYSQL: dbIcon,
  POSTGRESQL: dbIcon,
  MONGO: dbIcon,
  DB: dbIcon,
  DATABASE: dbIcon,
}

export function iconForAgentType(agentType: string): string {
  return TYPE_TO_ICON[agentType.toUpperCase()] ?? tomcatIcon
}
