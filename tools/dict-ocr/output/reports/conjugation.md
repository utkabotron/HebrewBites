# OCR Quality — conjugation

## Summary

| Metric | Value |
|---|---|
| Ground truth entries | 1 |
| Matched | 1 |
| Coverage | **100%** |
| Hebrew accuracy (with nikkud) | **7.14%** |
| Hebrew accuracy (normalized) | **7.14%** |
| Hallucinations | 0 |
| Missing | 0 |
| Structure errors | 2 |

## Field accuracy

| Field | Strict | Normalized | Total |
|---|---|---|---|
| `infinitive_he` | 100% (1/1) | 100% (1/1) | 1 |
| `gerund_he` | 100% (1/1) | 100% (1/1) | 1 |
| `tenses.past` | 0% (0/1) | 0% (0/1) | 1 |
| `tenses.present` | 0% (0/1) | 0% (0/1) | 1 |
| `tenses.future` | 0% (0/1) | 0% (0/1) | 1 |
| `tenses.imperative` | 0% (0/1) | 0% (0/1) | 1 |

## Entries

### ❌ MATCHED (id: גמר|פעל)

| | field | expected | actual |
|---|---|---|---|
| ✅ | `infinitive_he` | `לִגְמֹר` | `לִגְמֹר` |
| ✅ | `gerund_he` | `גְּמִירָה` | `גְּמִירָה` |
| ❌ | `tenses.past` | `[{"person":"אני","he":"","translit":""},{"person":"אתה","he":"","translit":""},{"person":"את","he":"","translit":""},{"person":"הוא","he":"","translit":""},{"person":"היא","he":"","translit":""},{"person":"אנחנו","he":"","translit":""},{"person":"אתם","he":"","translit":""},{"person":"אתן","he":"","translit":""},{"person":"הם","he":"","translit":""},{"person":"הן","he":"","translit":""}]` | `[{"person":"אני","he":"גָּמַרְתִּי","translit":"gamarti"},{"person":"אתה","he":"גָּמַרְתָּ","translit":"gamarta"},{"person":"את","he":"גָּמַרְתְּ","translit":"gamart"},{"person":"הוא","he":"גָּמַר","translit":"gamar"},{"person":"היא","he":"גָּמְרָה","translit":"gamra"},{"person":"אנחנו","he":"גָּמַרְנוּ","translit":"gamarnu"},{"person":"אתם","he":"גְּמַרְתֶּם","translit":"gmartem"},{"person":"אתן","he":"גְּמַרְתֶּן","translit":"gmarten"},{"person":"הם","he":"גָּמְרוּ","translit":"gamru"},{"person":"הן","he":"גָּמְרוּ","translit":"gamru"}]` |
| ❌ | `tenses.present` | `[{"person":"הוא","he":"","translit":""},{"person":"היא","he":"","translit":""},{"person":"הם","he":"","translit":""},{"person":"הן","he":"","translit":""}]` | `[{"person":"אני","he":"גּוֹמֵר","translit":"gomer"},{"person":"אתה","he":"גּוֹמֵר","translit":"gomer"},{"person":"את","he":"גּוֹמֶרֶת","translit":"gomeret"},{"person":"הוא","he":"גּוֹמֵר","translit":"gomer"},{"person":"היא","he":"גּוֹמֶרֶת","translit":"gomeret"},{"person":"אנחנו","he":"גּוֹמְרִים","translit":"gomrim"},{"person":"אתם","he":"גּוֹמְרִים","translit":"gomrim"},{"person":"אתן","he":"גּוֹמְרוֹת","translit":"gomrot"}]` |
| ❌ | `tenses.future` | `[{"person":"אני","he":"","translit":""},{"person":"אתה","he":"","translit":""},{"person":"את","he":"","translit":""},{"person":"הוא","he":"","translit":""},{"person":"היא","he":"","translit":""},{"person":"אנחנו","he":"","translit":""},{"person":"אתם","he":"","translit":""},{"person":"אתן","he":"","translit":""},{"person":"הם","he":"","translit":""},{"person":"הן","he":"","translit":""}]` | `[{"person":"אני","he":"אֶגְמֹר","translit":"egmor"},{"person":"אתה","he":"תִּגְמֹר","translit":"tigmor"},{"person":"את","he":"תִּגְמְרִי","translit":"tigmery"},{"person":"הוא","he":"יִגְמֹר","translit":"yigmor"},{"person":"היא","he":"תִּגְמֹר","translit":"tigmor"},{"person":"אנחנו","he":"נִגְמֹר","translit":"nigmor"},{"person":"אתם","he":"תִּגְמְרוּ","translit":"tigmru"},{"person":"אתן","he":"תִּגְמְרוּ","translit":"tigmru"},{"person":"הם","he":"יִגְמְרוּ","translit":"yigmru"},{"person":"הן","he":"יִגְמְרוּ","translit":"yigmru"}]` |
| ❌ | `tenses.imperative` | `[{"person":"אתה","he":"","translit":""},{"person":"את","he":"","translit":""},{"person":"אתם","he":"","translit":""},{"person":"אתן","he":"","translit":""}]` | `[{"person":"אתה","he":"גְּמֹר","translit":"gmor"},{"person":"את","he":"גִּמְרִי","translit":"gimri"},{"person":"אתם","he":"גִּמְרוּ","translit":"gimru"},{"person":"אתן","he":"גִּמְרוּ","translit":"gimru"}]` |
