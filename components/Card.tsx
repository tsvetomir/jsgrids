import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import { GoIssueOpened, GoRepoForked, GoStar } from 'react-icons/go'
import { FEATURES } from '../lib/features'
import { AugmentedInfo } from '../lib/libraries'
import classNames from 'classnames'

const Tidbit: React.FC<{
  icon: React.ReactNode
  value?: any
  title: string
}> = ({ icon, value, title }) => (
  <FeatureText size="big">
    <span
      title={title}
      className={classNames(
        'flex flex-row justify-center items-center',
        value ? 'text-gray-800' : 'text-gray-500'
      )}
    >
      {icon}&nbsp;{value || 'n/a'}
    </span>
  </FeatureText>
)

// Sort the features by positive ones first, then middling ones.
const sortedFeatureNames = (features: AugmentedInfo['features']): string[] =>
  Object.keys(features).sort((a, b) => {
    const av = features[a]
    const bv = features[b]
    if (av === true && bv === true) {
      return a.localeCompare(b)
    } else if (typeof av === 'string' && typeof bv === 'string') {
      return a.localeCompare(b)
    } else if (av === true) {
      return -1
    } else if (bv === true) {
      return 1
    } else {
      return a.localeCompare(b)
    }
  })

const FeatureText: React.FC<{ size?: 'big' | 'small ' }> = ({
  children,
  size = 'small',
}) => (
  <span
    className={`text-${
      size === 'big' ? 'sm' : 'xs'
    } text-gray-800 uppercase leading-tight`}
  >
    {children}
  </span>
)

const FeatureList: React.FC<{ features: AugmentedInfo['features'] }> = ({
  features,
}) => (
  <div className="grid grid-cols-2">
    {sortedFeatureNames(features).map((name) => (
      <FeatureWithIcon name={name} value={features[name]} />
    ))}
  </div>
)

const FeatureWithIcon: React.FC<{
  name: string
  value: boolean | string | null
}> = ({ name, value }) => {
  if (!FEATURES[name]) {
    throw new Error(`Unknown feature name: ${name}`)
  }
  const { title, description } = FEATURES[name]
  if (value) {
    return (
      <FeatureText>
        <span
          title={typeof value === 'string' ? value : description}
          className="flex flex-row items-center mb-1"
        >
          {value === true ? (
            <FaCheckCircle className="flex-none w-3 text-green-400" />
          ) : (
            <FaInfoCircle className="flex-none w-3 text-yellow-500" />
          )}
          <span className="ml-1">{title}</span>
        </span>
      </FeatureText>
    )
  } else {
    return null
  }
}

const ActionButton: React.FC<{ href: string; title: string }> = ({
  href,
  title,
}) => (
  <a
    href={href}
    className={classNames(
      'block p-2 rounded-md border border-transparent text-center flex justify-center items-center',
      'uppercase text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900',
      'transition transition-shadow hover:shadow-sm duration-100'
    )}
  >
    {title}
  </a>
)

const Actions: React.FC<{ info: AugmentedInfo }> = ({ info }) => (
  <div className="grid grid-cols-3 gap-4">
    <ActionButton href={info.demoUrl} title="Demo" />
    <ActionButton href={info.github.url} title="Source" />
    <ActionButton href={info.homeUrl} title="Home" />
  </div>
)

const Card: React.FC<{ info: AugmentedInfo }> = ({ info }) => {
  const gh = info.github
  return (
    <div className="bg-white block p-8 shadow-md rounded-md text-gray-900 flex flex-col justify-start">
      <div className="mb-4 text-2xl text-center font-semibold">
        {info.title}
      </div>
      <div className="mb-4">{info.description}</div>
      <div className="mb-4 grid grid-cols-3">
        <Tidbit
          icon={<GoStar />}
          value={gh?.stars}
          title={`${gh?.stars} stars on GitHub`}
        />
        <Tidbit
          icon={<GoRepoForked />}
          value={gh?.forks}
          title={`${gh?.stars} forks on GitHub`}
        />
        <Tidbit
          icon={<GoIssueOpened />}
          value={gh?.openIssues}
          title={`${gh?.stars} open issues on GitHub`}
        />
      </div>
      <div className="mb-4">
        <FeatureList features={info.features} />
      </div>
      <div className="flex-grow"></div>
      <div className="">
        <Actions info={info} />
      </div>
    </div>
  )
}

export default Card