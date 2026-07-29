import { describe, expect, it } from 'vitest'

import { readProperty, stringList, terminalSlug } from './properties'

describe('Notion property conversion', () => {
  it('reads official property shapes', () => {
    expect(readProperty({ type: 'title', title: [{ plain_text: 'IGNAI' }] })).toBe('IGNAI')
    expect(readProperty({ select: { name: 'Event' }, type: 'select' })).toBe('Event')
    expect(readProperty({ multi_select: [{ name: 'AI' }, { name: '长沙' }], type: 'multi_select' })).toEqual([
      'AI',
      '长沙',
    ])
  })

  it('normalizes relation lists and prefixed slugs', () => {
    expect(stringList('members/qianzhu，alice')).toEqual(['members/qianzhu', 'alice'])
    expect(terminalSlug('members/Qianzhu', '', 'id')).toBe('qianzhu')
  })
})
