# Backend Translation System for MoodTracker
# Support for English (en) and Myanmar (my)

TRANSLATIONS = {
    'en': {
        # Test Categories
        'category_mental_health': 'Mental Health Screening',

        # Test Names
        'test_phq9_name': 'PHQ-9 Depression Screening',
        'test_gad7_name': 'GAD-7 Anxiety Screening',
        'test_pss10_name': 'PSS-10 Stress Assessment',
        'test_bigfive_name': 'Big Five Personality Test',

        # Test Descriptions
        'test_phq9_desc': "The Patient Health Questionnaire-9 (PHQ-9) is a brief screening tool for depression. Over the past 2 weeks, how often have you been bothered by the following problems?",
        'test_gad7_desc': "The Generalized Anxiety Disorder-7 (GAD-7) is a brief screening tool for anxiety. Over the past 2 weeks, how often have you been bothered by the following problems?",
        'test_pss10_desc': "The Perceived Stress Scale-10 (PSS-10) measures how stressful situations in your life are perceived. In the last month, how often have you felt or thought the following?",
        'test_bigfive_desc': "The Big Five personality test measures five major dimensions of personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. Please rate how accurately each statement describes you.",

        # PHQ-9 Questions (Test ID: 1)
        'phq9_q1': "Little interest or pleasure in doing things",
        'phq9_q2': "Feeling down, depressed, or hopeless",
        'phq9_q3': "Trouble falling or staying asleep, or sleeping too much",
        'phq9_q4': "Feeling tired or having little energy",
        'phq9_q5': "Poor appetite or overeating",
        'phq9_q6': "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
        'phq9_q7': "Trouble concentrating on things, such as reading the newspaper or watching television",
        'phq9_q8': "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
        'phq9_q9': "Thoughts that you would be better off dead, or of hurting yourself",

        # GAD-7 Questions (Test ID: 2)
        'gad7_q1': "Feeling nervous, anxious, or on edge",
        'gad7_q2': "Not being able to stop or control worrying",
        'gad7_q3': "Worrying too much about different things",
        'gad7_q4': "Trouble relaxing",
        'gad7_q5': "Being so restless that it's hard to sit still",
        'gad7_q6': "Becoming easily annoyed or irritable",
        'gad7_q7': "Feeling afraid as if something awful might happen",

        # PSS-10 Questions (Test ID: 4)
        'pss10_q1': "In the last month, how often have you been upset because of something that happened unexpectedly?",
        'pss10_q2': "In the last month, how often have you felt that you were unable to control the important things in your life?",
        'pss10_q3': "In the last month, how often have you felt nervous and stressed?",
        'pss10_q4': "In the last month, how often have you felt confident about your ability to handle your personal problems?",
        'pss10_q5': "In the last month, how often have you felt that things were going your way?",
        'pss10_q6': "In the last month, how often have you found that you could not cope with all the things that you had to do?",
        'pss10_q7': "In the last month, how often have you been able to control irritations in your life?",
        'pss10_q8': "In the last month, how often have you felt that you were on top of things?",
        'pss10_q9': "In the last month, how often have you been angered because of things that were outside of your control?",
        'pss10_q10': "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",

        # Big Five Questions (Test ID: 3)
        'bigfive_q1': "I am the life of the party",
        'bigfive_q2': "I don't talk a lot",
        'bigfive_q3': "I feel comfortable around people",
        'bigfive_q4': "I keep in the background",
        'bigfive_q5': "I start conversations",
        'bigfive_q6': "I have little to say",
        'bigfive_q7': "I talk to a lot of different people at parties",
        'bigfive_q8': "I don't like to draw attention to myself",
        'bigfive_q9': "I don't mind being the center of attention",
        'bigfive_q10': "I am quiet around strangers",
        'bigfive_q11': "I feel little concern for others",
        'bigfive_q12': "I am interested in people",
        'bigfive_q13': "I insult people",
        'bigfive_q14': "I sympathize with others' feelings",
        'bigfive_q15': "I am not interested in other people's problems",
        'bigfive_q16': "I have a soft heart",
        'bigfive_q17': "I am not really interested in others",
        'bigfive_q18': "I take time out for others",
        'bigfive_q19': "I feel others' emotions",
        'bigfive_q20': "I make people feel at ease",
        'bigfive_q21': "I am always prepared",
        'bigfive_q22': "I leave my belongings around",
        'bigfive_q23': "I pay attention to details",
        'bigfive_q24': "I make a mess of things",
        'bigfive_q25': "I get chores done right away",
        'bigfive_q26': "I often forget to put things back in their proper place",
        'bigfive_q27': "I like order",
        'bigfive_q28': "I shirk my duties",
        'bigfive_q29': "I follow a schedule",
        'bigfive_q30': "I am exacting in my work",
        'bigfive_q31': "I get stressed out easily",
        'bigfive_q32': "I am relaxed most of the time",
        'bigfive_q33': "I worry about things",
        'bigfive_q34': "I seldom feel blue",
        'bigfive_q35': "I am easily disturbed",
        'bigfive_q36': "I get upset easily",
        'bigfive_q37': "I change my mood a lot",
        'bigfive_q38': "I have frequent mood swings",
        'bigfive_q39': "I get irritated easily",
        'bigfive_q40': "I often feel blue",
        'bigfive_q41': "I have a rich vocabulary",
        'bigfive_q42': "I have difficulty understanding abstract ideas",
        'bigfive_q43': "I have a vivid imagination",
        'bigfive_q44': "I am not interested in abstract ideas",
        'bigfive_q45': "I have excellent ideas",
        'bigfive_q46': "I do not have a good imagination",
        'bigfive_q47': "I am quick to understand things",
        'bigfive_q48': "I use difficult words",
        'bigfive_q49': "I spend time reflecting on things",
        'bigfive_q50': "I am full of ideas",

        # Response Options - PHQ-9 & GAD-7
        'response_not_at_all': "Not at all",
        'response_several_days': "Several days",
        'response_more_than_half': "More than half the days",
        'response_nearly_every_day': "Nearly every day",

        # Response Options - PSS-10
        'response_never': "Never",
        'response_almost_never': "Almost Never",
        'response_sometimes': "Sometimes",
        'response_fairly_often': "Fairly Often",
        'response_very_often': "Very Often",

        # Response Options - Big Five
        'response_very_inaccurate': "Very Inaccurate",
        'response_moderately_inaccurate': "Moderately Inaccurate",
        'response_neither': "Neither Accurate nor Inaccurate",
        'response_moderately_accurate': "Moderately Accurate",
        'response_very_accurate': "Very Accurate",

        # Recommendations
        'rec_journaling': 'Continue regular journaling to track your emotional patterns',
        'rec_retake': 'Consider retaking assessments to track progress over time',
        'rec_connections': 'Maintain connections with supportive friends and family',
        'rec_relaxation': 'Try relaxation techniques like deep breathing or progressive muscle relaxation',
        'rec_caffeine': 'Limit caffeine intake which can increase anxiety',
        'rec_stressors': 'Identify your main stressors and develop specific coping strategies',
        'rec_sleep': 'Ensure you are getting adequate sleep and regular physical activity',
        'rec_professional': 'Consider speaking with a mental health professional about your symptoms',
        'rec_mindfulness': 'Practice mindfulness or meditation to reduce stress',
        'rec_exercise': 'Regular physical exercise can significantly improve mood and reduce anxiety',
        'rec_social': 'Engage in social activities and maintain meaningful relationships',
        'rec_routine': 'Establish a daily routine to provide structure and stability'
    },

    'my': {
        # Test Categories
        'category_mental_health': 'စိတ်ကျန်းမာရေး စစ်ဆေးခြင်း',

        # Test Names
        'test_phq9_name': 'PHQ-9 စိတ်ကျရောဂါ စစ်ဆေးခြင်း',
        'test_gad7_name': 'GAD-7 စိုးရိမ်ပူပန်မှု စစ်ဆေးခြင်း',
        'test_pss10_name': 'PSS-10 စိတ်ဖိစီးမှု အကဲဖြတ်ခြင်း',
        'test_bigfive_name': 'Big Five ကိုယ်ရေးကိုယ်တာ စရိုက်လက္ခဏာ စစ်ဆေးခြင်း',

        # Test Descriptions
        'test_phq9_desc': "လူနာကျန်းမာရေး မေးခွန်းစစ်-၉ (PHQ-9) သည် စိတ်ကျရောဂါအတွက် အတိုချုံးစစ်ဆေးမှုကိရိယာဖြစ်သည်။ နောက်ဆုံး ၂ ပတ်အတွင်း အောက်ပါပြဿနာများဖြင့် ဘယ်လောက်မကြာခဏ စိတ်အနှောင့်အယှက်ဖြစ်ခဲ့ပါသလဲ?",
        'test_gad7_desc': "ယေဘုယျ စိုးရိမ်ပူပန်မှုရောဂါ-၇ (GAD-7) သည် စိုးရိမ်ပူပန်မှုအတွက် အတိုချုံးစစ်ဆေးမှုကိရိယာဖြစ်သည်။ နောက်ဆုံး ၂ ပတ်အတွင်း အောက်ပါပြဿနာများဖြင့် ဘယ်လောက်မကြာခဏ စိတ်အနှောင့်အယှက်ဖြစ်ခဲ့ပါသလဲ?",
        'test_pss10_desc': "အသိအမှတ်ပြုစိတ်ဖိစီးမှုအတိုင်းအတာ-၁၀ (PSS-10) သည် သင့်ဘဝရှိအခြေအနေများကို ဘယ်လောက်စိတ်ဖိစီးဖွယ်ကောင်းသည်ဟု ခံစားရသည်ကိုတိုင်းတာသည်။ လွန်ခဲ့သောတစ်လအတွင်း အောက်ပါအရာများကို ဘယ်လောက်မကြာခဏ ခံစားမိ သို့မဟုတ် စဉ်းစားမိပါသလဲ?",
        'test_bigfive_desc': "Big Five ကိုယ်ရေးကိုယ်တာစရိုက်စစ်ဆေးမှုသည် ကိုယ်ရေးကိုယ်တာစရိုက်လက္ခဏာငါးမျိုးကိုတိုင်းတာသည် - ဖွင့်ဟမှု၊ တာဝန်သိမှု၊ အပြင်ဦးတိုးမှု၊ သဘောထားပြေပြစ်မှု နှင့် စိုးရိမ်ပူပန်မှု။ ကျေးဇူးပြု၍ အောက်ပါဖော်ပြချက်တစ်ခုချင်းစီသည် သင့်ကိုဘယ်လောက်တိကျစွာဖော်ပြသည်ကို အဆင့်သတ်မှတ်ပါ။",

        # PHQ-9 Questions (Test ID: 1)
        'phq9_q1': "အရာဝတ္ထုများပြုလုပ်ရာတွင် စိတ်ဝင်စားမှု သို့မဟုတ် ပျော်ရွှင်မှုနည်းခြင်း",
        'phq9_q2': "စိတ်ဓာတ်ကျခြင်း၊ စိတ်အားငယ်ခြင်း သို့မဟုတ် မျှော်လင့်ချက်ကင်းမဲ့ခြင်း",
        'phq9_q3': "အိပ်ပျော်ရန် သို့မဟုတ် အိပ်ပျော်အောင်နေရန် အခက်အခဲရှိခြင်း၊ သို့မဟုတ် အလွန်အမင်းအိပ်ခြင်း",
        'phq9_q4': "မောပန်းနွမ်းနယ်ခြင်း သို့မဟုတ် စွမ်းအင်နည်းခြင်း",
        'phq9_q5': "အစားအသောက်ပျက်ခြင်း သို့မဟုတ် အလွန်အမင်းစားသောက်ခြင်း",
        'phq9_q6': "မိမိကိုယ်ကို ယုံကြည်မှုနည်းခြင်း - သို့မဟုတ် ကျရှုံးသူဖြစ်သည်ဟု ခံစားရခြင်း သို့မဟုတ် မိမိကိုယ်မိမိ သို့မဟုတ် မိသားစုကို စိတ်ပျက်အောင် ပြုလုပ်မိခြင်း",
        'phq9_q7': "သတင်းစာဖတ်ခြင်း သို့မဟုတ် တီဗီကြည့်ခြင်းကဲ့သို့သော အရာများကို အာရုံစိုက်ရန် အခက်အခဲရှိခြင်း",
        'phq9_q8': "အခြားသူများ သတိထားမိနိုင်လောက်အောင် နှေးကွေးစွာ လှုပ်ရှားခြင်း သို့မဟုတ် ပြောဆိုခြင်း။ သို့မဟုတ် ဆန့်ကျင်ဘက်ဖြစ်ခြင်း - ပုံမှန်ထက် ပိုမိုလှုပ်ရှားနေလောက်အောင် ဂနာမငြိမ်ဖြစ်ခြင်း သို့မဟုတ် မအေးချမ်းခြင်း",
        'phq9_q9': "သေသွားခြင်းက ပိုကောင်းမည်ဟု ထင်မြင်ခြင်း၊ သို့မဟုတ် မိမိကိုယ်ကို ထိခိုက်ခြင်း အကြောင်းအတွေးများ",

        # GAD-7 Questions (Test ID: 2)
        'gad7_q1': "စိုးရိမ်ပူပန်နေခြင်း၊ စိတ်လှုပ်ရှားနေခြင်း သို့မဟုတ် စိတ်ဆိုးနေခြင်း",
        'gad7_q2': "စိုးရိမ်ပူပန်မှုကို ရပ်တန့်ရန် သို့မဟုတ် ထိန်းချုပ်ရန် မတတ်နိုင်ခြင်း",
        'gad7_q3': "ကွဲပြားသောအရာများအကြောင်း အလွန်အမင်းစိုးရိမ်ပူပန်နေခြင်း",
        'gad7_q4': "စိတ်ဖြေလျှော့ရန် အခက်အခဲရှိခြင်း",
        'gad7_q5': "ထိုင်ရန် အခက်အခဲရှိလောက်အောင် ဂနာမငြိမ်ဖြစ်နေခြင်း",
        'gad7_q6': "အလွယ်တကူ စိတ်ဆိုးခြင်း သို့မဟုတ် ဒေါသထွက်ခြင်း",
        'gad7_q7': "အလွန်ဆိုးရွားသောအရာတစ်ခုခု ဖြစ်လာနိုင်သည်ဟု ခံစားရခြင်း",

        # PSS-10 Questions (Test ID: 4)
        'pss10_q1': "လွန်ခဲ့သောလတွင် မျှော်လင့်မထားသောအရာတစ်ခုခုကြောင့် သင် ဘယ်နှစ်ကြိမ်ခန့် စိတ်ဆင်းရဲခံစားရသနည်း",
        'pss10_q2': "လွန်ခဲ့သောလတွင် သင့်ဘဝရှိအရေးကြီးသောအရာများကို ထိန်းချုပ်နိုင်စွမ်းမရှိဟု သင် ဘယ်နှစ်ကြိမ်ခန့် ခံစားရသနည်း",
        'pss10_q3': "လွန်ခဲ့သောလတွင် စိတ်လှုပ်ရှားပြီး ဖိစီးနေသည်ဟု သင် ဘယ်နှစ်ကြိမ်ခန့် ခံစားရသနည်း",
        'pss10_q4': "လွန်ခဲ့သောလတွင် သင့်ကိုယ်ပိုင်ပြဿနာများကို ကိုင်တွယ်ဖြေရှင်းနိုင်စွမ်းအပေါ် ယုံကြည်မှုရှိသည်ဟု သင် ဘယ်နှစ်ကြိမ်ခန့် ခံစားရသနည်း",
        'pss10_q5': "လွန်ခဲ့သောလတွင် အရာဝတ္ထုများသည် သင့်အတွက်ဖြစ်နေသည်ဟု သင် ဘယ်နှစ်ကြိမ်ခန့် ခံစားရသနည်း",
        'pss10_q6': "လွန်ခဲ့သောလတွင် သင် လုပ်ရမည့်အရာများအားလုံးကို မကိုင်တွယ်နိုင်ခဲ့ဟု သင် ဘယ်နှစ်ကြိမ်ခန့် တွေ့ရှိခဲ့သနည်း",
        'pss10_q7': "လွန်ခဲ့သောလတွင် သင့်ဘဝရှိ စိတ်တိုစရာများကို ထိန်းချုပ်နိုင်ခဲ့သည်ဟု သင် ဘယ်နှစ်ကြိမ်ခန့် ခံစားရသနည်း",
        'pss10_q8': "လွန်ခဲ့သောလတွင် အရာဝတ္ထုများကို သင် ထိထိရောက်ရောက်လုပ်နိုင်သည်ဟု ဘယ်နှစ်ကြိမ်ခန့် ခံစားရသနည်း",
        'pss10_q9': "လွန်ခဲ့သောလတွင် သင့်ထိန်းချုပ်မှုပြင်ပတွင်ရှိသောအရာများကြောင့် သင် ဘယ်နှစ်ကြိမ်ခန့် စိတ်ဆိုးခဲ့သနည်း",
        'pss10_q10': "လွန်ခဲ့သောလတွင် သင် မကျော်လွှားနိုင်လောက်အောင် အခက်အခဲများ စုပုံနေသည်ဟု ဘယ်နှစ်ကြိမ်ခန့် ခံစားရသနည်း",

        # Big Five Questions (Test ID: 3)
        'bigfive_q1': "ကျွန်ုပ်သည် ပါတီ၏အသက်သွေးကြောဖြစ်သည်",
        'bigfive_q2': "ကျွန်ုပ်သည် အများအပြားမပြောဆိုပါ",
        'bigfive_q3': "ကျွန်ုပ်သည် လူများနှင့်ပတ်ဝန်းကျင်တွင် သက်တောင့်သက်သာရှိသည်",
        'bigfive_q4': "ကျွန်ုပ်သည် နောက်ခံတွင်သာနေတတ်သည်",
        'bigfive_q5': "ကျွန်ုပ်သည် စကားစမြည်စပြောတတ်သည်",
        'bigfive_q6': "ကျွန်ုပ်တွင် ပြောစရာနည်းသည်",
        'bigfive_q7': "ပါတီများတွင် ကျွန်ုပ်သည် ကွဲပြားသောလူများစွာနှင့် စကားပြောသည်",
        'bigfive_q8': "ကျွန်ုပ်သည် အာရုံစိုက်ခံရခြင်းကို မနှစ်သက်ပါ",
        'bigfive_q9': "ကျွန်ုပ်သည် ဗဟိုအချက်အချာကျသောနေရာတွင် ရှိနေရခြင်းကို မစဉ်းစားပါ",
        'bigfive_q10': "ကျွန်ုပ်သည် သူစိမ်းများနှင့် ဆိတ်ဆိတ်နေတတ်သည်",
        'bigfive_q11': "ကျွန်ုပ်သည် အခြားသူများအတွက် စိုးရိမ်ပူပန်မှုနည်းသည်",
        'bigfive_q12': "ကျွန်ုပ်သည် လူများကို စိတ်ဝင်စားသည်",
        'bigfive_q13': "ကျွန်ုပ်သည် လူများကို စော်ကားတတ်သည်",
        'bigfive_q14': "ကျွန်ုပ်သည် အခြားသူများ၏ခံစားချက်များကို နားလည်တတ်သည်",
        'bigfive_q15': "ကျွန်ုပ်သည် အခြားသူများ၏ပြဿနာများကို စိတ်မဝင်စားပါ",
        'bigfive_q16': "ကျွန်ုပ်၏စိတ်နှလုံးသည် နူးညံ့သည်",
        'bigfive_q17': "ကျွန်ုပ်သည် အခြားသူများကို အမှန်တကယ် စိတ်မဝင်စားပါ",
        'bigfive_q18': "ကျွန်ုပ်သည် အခြားသူများအတွက် အချိန်ပေးသည်",
        'bigfive_q19': "ကျွန်ုပ်သည် အခြားသူများ၏စိတ်ခံစားချက်များကို ခံစားတတ်သည်",
        'bigfive_q20': "ကျွန်ုပ်သည် လူများကို သက်တောင့်သက်သာဖြစ်အောင် ပြုလုပ်ပေးသည်",
        'bigfive_q21': "ကျွန်ုပ်သည် အမြဲတမ်းပြင်ဆင်ထားသည်",
        'bigfive_q22': "ကျွန်ုပ်သည် ကျွန်ုပ်၏ပစ္စည်းများကို ပတ်ဝန်းကျင်တွင် ချန်ထားတတ်သည်",
        'bigfive_q23': "ကျွန်ုပ်သည် အသေးစိတ်အချက်များကို အာရုံစိုက်သည်",
        'bigfive_q24': "ကျွန်ုပ်သည် အရာဝတ္ထုများကို ရှုပ်ပွေစေတတ်သည်",
        'bigfive_q25': "ကျွန်ုပ်သည် အလုပ်များကို ချက်ချင်းပြီးအောင်လုပ်သည်",
        'bigfive_q26': "ကျွန်ုပ်သည် အရာဝတ္ထုများကို သင့်တော်သောနေရာသို့ ပြန်မထားမိခြင်း မကြာခဏဖြစ်တတ်သည်",
        'bigfive_q27': "ကျွန်ုပ်သည် အစီအစဉ်ကျနမှုကို ကြိုက်နှစ်သက်သည်",
        'bigfive_q28': "ကျွန်ုပ်သည် ကျွန်ုပ်၏တာဝန်များကို ရှောင်ရှားတတ်သည်",
        'bigfive_q29': "ကျွန်ုပ်သည် အချိန်ဇယားကို လိုက်နာသည်",
        'bigfive_q30': "ကျွန်ုပ်သည် ကျွန်ုပ်၏အလုပ်တွင် တိကျမှုရှိသည်",
        'bigfive_q31': "ကျွန်ုပ်သည် အလွယ်တကူ စိတ်ဖိစီးမှုခံစားရသည်",
        'bigfive_q32': "ကျွန်ုပ်သည် အချိန်အများစုတွင် စိတ်အေးလက်အေးရှိသည်",
        'bigfive_q33': "ကျွန်ုပ်သည် အရာဝတ္ထုများအကြောင်း စိုးရိမ်တတ်သည်",
        'bigfive_q34': "ကျွန်ုပ်သည် ခဏခဏ စိတ်မပျော်ရွှင်ဖြစ်တတ်သည်",
        'bigfive_q35': "ကျွန်ုပ်သည် အလွယ်တကူ စိတ်အနှောင့်အယှက်ဖြစ်တတ်သည်",
        'bigfive_q36': "ကျွန်ုပ်သည် အလွယ်တကူ စိတ်ဆိုးတတ်သည်",
        'bigfive_q37': "ကျွန်ုပ်၏စိတ်အခြေအနေသည် အများအပြားပြောင်းလဲတတ်သည်",
        'bigfive_q38': "ကျွန်ုပ်၌ စိတ်အခြေအနေ မကြာခဏပြောင်းလဲတတ်သည်",
        'bigfive_q39': "ကျွန်ုပ်သည် အလွယ်တကူ စိတ်တိုတတ်သည်",
        'bigfive_q40': "ကျွန်ုပ်သည် မကြာခဏ စိတ်မပျော်ရွှင်ဖြစ်တတ်သည်",
        'bigfive_q41': "ကျွန်ုပ်၌ ကြွယ်ဝသော ဝေါဟာရရှိသည်",
        'bigfive_q42': "ကျွန်ုပ်သည် စိတ်ကူးယဉ်အတွေးအခေါ်များကို နားလည်ရန် အခက်အခဲရှိသည်",
        'bigfive_q43': "ကျွန်ုပ်၌ ထင်ရှားသော စိတ်ကူးစိတ်သန်းရှိသည်",
        'bigfive_q44': "ကျွန်ုပ်သည် စိတ်ကူးယဉ်အတွေးအခေါ်များကို စိတ်မဝင်စားပါ",
        'bigfive_q45': "ကျွန်ုပ်၌ ကောင်းမွန်သော အတွေးအခေါ်များရှိသည်",
        'bigfive_q46': "ကျွန်ုပ်၌ ကောင်းမွန်သော စိတ်ကူးစိတ်သန်းမရှိပါ",
        'bigfive_q47': "ကျွန်ုပ်သည် အရာဝတ္ထုများကို မြန်မြန်နားလည်သည်",
        'bigfive_q48': "ကျွန်ုပ်သည် ခက်ခဲသောစကားလုံးများကို အသုံးပြုသည်",
        'bigfive_q49': "ကျွန်ုပ်သည် အရာဝတ္ထုများကို ပြန်လည်သုံးသပ်ရန် အချိန်ပေးသည်",
        'bigfive_q50': "ကျွန်ုပ်သည် အတွေးအခေါ်များဖြင့် ပြည့်နှက်နေသည်",

        # Response Options - PHQ-9 & GAD-7
        'response_not_at_all': "မဖြစ်ခဲ့ပါ",
        'response_several_days': "ရက်အနည်းငယ်",
        'response_more_than_half': "ရက်တစ်ဝက်ကျော်",
        'response_nearly_every_day': "နေ့တိုင်းနီးပါး",

        # Response Options - PSS-10
        'response_never': "ဘယ်တော့မှ",
        'response_almost_never': "အလွန်ရှားပါး",
        'response_sometimes': "တစ်ခါတစ်ရံ",
        'response_fairly_often': "အတန်အသင့်မကြာခဏ",
        'response_very_often': "အလွန်မကြာခဏ",

        # Response Options - Big Five
        'response_very_inaccurate': "အလွန်မှားယွင်း",
        'response_moderately_inaccurate': "အတန်အသင့်မှားယွင်း",
        'response_neither': "မှန်ကန်ခြင်းမရှိ၊ မှားယွင်းခြင်းလည်းမရှိ",
        'response_moderately_accurate': "အတန်အသင့်မှန်ကန်",
        'response_very_accurate': "အလွန်မှန်ကန်",

        # Recommendations
        'rec_journaling': 'သင့်စိတ်ခံစားမှုပုံစံများကို ခြေရာခံရန် ပုံမှန်ဂျာနယ်ရေးသားခြင်းဆက်လက်လုပ်ဆောင်ပါ',
        'rec_retake': 'အချိန်နှင့်အမျှ တိုးတက်မှုကိုခြေရာခံရန် အကဲဖြတ်မှုများကို ပြန်လည်ဖြေဆိုရန် စဉ်းစားပါ',
        'rec_connections': 'ထောက်ခံသောမိတ်ဆွေများနှင့် မိသားစုများနှင့် ဆက်သွယ်မှုထားရှိပါ',
        'rec_relaxation': 'အသက်ရှူလေ့ကျင့်ခန်း သို့မဟုတ် တိုးတက်သောကြွက်သားအေးချမ်းမှုကဲ့သို့ အေးချမ်းသောနည်းလမ်းများကို စမ်းကြည့်ပါ',
        'rec_caffeine': 'စိုးရိမ်ပူပန်မှုတိုးစေနိုင်သော ကဖင်းဓာတ်စားသုံးမှုကို ကန့်သတ်ပါ',
        'rec_stressors': 'သင့်အဓိကစိတ်ဖိစီးမှုများကို ဖော်ထုတ်ပြီး တိကျသောကိုင်တွယ်ဖြေရှင်းနည်းများကို တီထွင်ပါ',
        'rec_sleep': 'လုံလောက်သောအိပ်စက်မှုနှင့် ပုံမှန်ကိုယ်လက်လှုပ်ရှားမှုရရှိစေပါ',
        'rec_professional': 'သင့်ရောဂါလက္ခဏာများအကြောင်း စိတ်ကျန်းမာရေးပညာရှင်နှင့် စကားပြောရန် စဉ်းစားပါ',
        'rec_mindfulness': 'စိတ်ဖိစီးမှုလျှော့ချရန် သတိပဋ္ဌာန် သို့မဟုတ် တရားထိုင်ခြင်းကို လေ့ကျင့်ပါ',
        'rec_exercise': 'ပုံမှန်ကိုယ်လက်လှုပ်ရှားမှုသည် စိတ်အခြေအနေကိုသိသိသာသာတိုးတက်စေပြီး စိုးရိမ်ပူပန်မှုကိုလျှော့ချနိုင်သည်',
        'rec_social': 'လူမှုရေးလှုပ်ရှားမှုများတွင် ပါဝင်ပြီး အဓိပ္ပါယ်ရှိသောဆက်ဆံရေးများကို ထိန်းသိမ်းပါ',
        'rec_routine': 'ဖွဲ့စည်းပုံနှင့် တည်ငြိမ်မှုပေးရန် နေ့စဉ်လုပ်ငန်းစဉ်ကို ထူထောင်ပါ'
    }
}

def get_translation(key, language='en'):
    """
    Get translated text for a given key and language

    Args:
        key: Translation key
        language: Language code ('en' or 'my')

    Returns:
        Translated string, or English fallback if not found
    """
    if language not in TRANSLATIONS:
        language = 'en'

    return TRANSLATIONS[language].get(key, TRANSLATIONS['en'].get(key, key))

def translate_test_data(test, language='en'):
    """
    Translate test data (name, description, category, questions, response options)

    Args:
        test: Test dictionary from database
        language: Language code ('en' or 'my')

    Returns:
        Test dictionary with translated fields
    """
    # Map test IDs to translation keys
    test_name_keys = {
        1: 'test_phq9_name',
        2: 'test_gad7_name',
        3: 'test_bigfive_name',
        4: 'test_pss10_name'
    }

    test_desc_keys = {
        1: 'test_phq9_desc',
        2: 'test_gad7_desc',
        3: 'test_bigfive_desc',
        4: 'test_pss10_desc'
    }

    test_id = test.get('test_id') or test.get('id')

    if test_id in test_name_keys:
        test['test_name'] = get_translation(test_name_keys[test_id], language)

    if test_id in test_desc_keys:
        test['description'] = get_translation(test_desc_keys[test_id], language)

    # Translate category
    test['category'] = get_translation('category_mental_health', language)

    # Translate questions if present
    if 'questions' in test:
        test['questions'] = [translate_question(q, test_id, language) for q in test['questions']]

    # Translate response options if present
    if 'response_options' in test:
        test['response_options'] = [translate_response_option(opt, test_id, language) for opt in test['response_options']]

    return test

def translate_question(question, test_id, language='en'):
    """
    Translate a single question

    Args:
        question: Question dictionary from database
        test_id: Test ID (1=PHQ-9, 2=GAD-7, 3=Big Five, 4=PSS-10)
        language: Language code ('en' or 'my')

    Returns:
        Question dictionary with translated text
    """
    question_number = question.get('question_number')

    # Map test ID and question number to translation key
    test_prefixes = {
        1: 'phq9',
        2: 'gad7',
        3: 'bigfive',
        4: 'pss10'
    }

    if test_id in test_prefixes:
        key = f"{test_prefixes[test_id]}_q{question_number}"
        question['question_text'] = get_translation(key, language)

    return question

def translate_response_option(option, test_id, language='en'):
    """
    Translate a response option

    Args:
        option: Response option dictionary from database
        test_id: Test ID (1=PHQ-9, 2=GAD-7, 3=Big Five, 4=PSS-10)
        language: Language code ('en' or 'my')

    Returns:
        Response option dictionary with translated text
    """
    option_text = option.get('option_text', '')

    # Map option text to translation keys
    response_map = {
        # PHQ-9 & GAD-7
        "Not at all": "response_not_at_all",
        "Several days": "response_several_days",
        "More than half the days": "response_more_than_half",
        "Nearly every day": "response_nearly_every_day",

        # PSS-10
        "Never": "response_never",
        "Almost Never": "response_almost_never",
        "Sometimes": "response_sometimes",
        "Fairly Often": "response_fairly_often",
        "Very Often": "response_very_often",

        # Big Five
        "Very Inaccurate": "response_very_inaccurate",
        "Moderately Inaccurate": "response_moderately_inaccurate",
        "Neither Accurate nor Inaccurate": "response_neither",
        "Moderately Accurate": "response_moderately_accurate",
        "Very Accurate": "response_very_accurate"
    }

    if option_text in response_map:
        option['option_text'] = get_translation(response_map[option_text], language)

    return option

def get_recommendations(language='en'):
    """
    Get mental health recommendations in specified language

    Args:
        language: Language code ('en' or 'my')

    Returns:
        List of recommendation strings
    """
    rec_keys = [
        'rec_journaling',
        'rec_retake',
        'rec_connections',
        'rec_relaxation',
        'rec_caffeine',
        'rec_stressors',
        'rec_sleep',
        'rec_professional'
    ]

    return [get_translation(key, language) for key in rec_keys]
