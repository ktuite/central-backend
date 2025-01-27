
// takes care of instance envelope boilerplate.
const instance = (formId, instanceId, data) =>
  `<data id="${formId}"><meta><instanceID>${instanceId}</instanceID></meta>${data}</data>`;

// provides orx: namespace on meta/instanceId and a form version.
const fullInstance = (formId, version, instanceId, data) =>
  `<data id="${formId}" version="${version}"><orx:meta><orx:instanceID>${instanceId}</orx:instanceID></orx:meta>${data}</data>`;

module.exports = {
  forms: {
    simple: `<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <h:title>Simple</h:title>
    <model>
      <instance>
        <data id="simple">
          <meta>
            <instanceID/>
          </meta>
          <name/>
          <age/>
        </data>
      </instance>

      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/name" type="string"/>
      <bind nodeset="/data/age" type="int"/>
    </model>

  </h:head>
  <h:body>
    <input ref="/data/name">
      <label>What is your name?</label>
    </input>
    <input ref="/data/age">
      <label>What is your age?</label>
    </input>
  </h:body>
</h:html>`,

    withrepeat: `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa" xmlns:orx="http://openrosa.org/xforms">
  <h:head>
    <model>
      <instance>
        <data id="withrepeat" orx:version="1.0">
          <orx:meta>
            <orx:instanceID/>
          </orx:meta>
          <name/>
          <age/>
          <children>
            <child jr:template="">
              <name/>
              <age/>
            </child>
          </children>
        </data>
      </instance>
      <bind nodeset="/data/orx:meta/orx:instanceID" preload="uid" type="string"/>
      <bind nodeset="/data/name" type="string"/>
      <bind nodeset="/data/age" type="int"/>
      <bind nodeset="/data/children/child/name" type="string"/>
      <bind nodeset="/data/children/child/age" type="int"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/name">
      <label>What is your name?</label>
    </input>
    <input ref="/data/age">
      <label>What is your age?</label>
    </input>
    <group ref="/data/children/child">
      <label>Child</label>
      <repeat nodeset="/data/children/child">
        <input ref="/data/children/child/name">
          <label>What is the child's name?</label>
        </input>
        <input ref="/data/children/child/age">
          <label>What is the child's age?</label>
        </input>
      </repeat>
    </group>
  </h:body>
</h:html>`,

    simple2: `<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <h:title>Simple 2</h:title>
    <model>
      <instance>
        <data id="simple2" version="2.1">
          <meta>
            <instanceID/>
          </meta>
          <name/>
          <age/>
        </data>
      </instance>

      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/name" type="string"/>
      <bind nodeset="/data/age" type="int"/>
    </model>

  </h:head>
  <h:body>
    <input ref="/data/name">
      <label>What is your name?</label>
    </input>
    <input ref="/data/age">
      <label>What is your age?</label>
    </input>
  </h:body>
</h:html>`,

    doubleRepeat: `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa" xmlns:orx="http://openrosa.org/xforms">
  <h:head>
    <model>
      <instance>
        <data id="doubleRepeat" orx:version="1.0">
          <orx:meta>
            <orx:instanceID/>
          </orx:meta>
          <name/>
          <children>
            <child>
              <name/>
              <toys>
                <toy>
                  <name/>
                </toy>
              </toys>
            </child>
          </children>
        </data>
      </instance>
      <bind nodeset="/data/orx:meta/orx:instanceID" preload="uid" type="string"/>
      <bind nodeset="/data/name" type="string"/>
      <bind nodeset="/data/children/child/name" type="string"/>
      <bind nodeset="/data/children/child/toys/toy/name" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/name">
      <label>What is your name?</label>
    </input>
    <group ref="/data/children/child">
      <label>Child</label>
      <repeat nodeset="/data/children/child">
        <input ref="/data/children/child/name">
          <label>What is the child's name?</label>
        </input>
        <group ref="/data/children/child/toys">
          <label>Child</label>
          <repeat nodeset="/data/children/child/toys/toy">
            <input ref="/data/children/child/toys/toy/name">
              <label>What is the toy's name?</label>
            </input>
          </repeat>
        </group>
      </repeat>
    </group>
  </h:body>
</h:html>`,

    withAttachments: `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <model>
      <instance>
        <data id="withAttachments">
          <name/>
          <age/>
          <hometown/>
        </data>
      </instance>
      <instance id="mydata" src="badnoroot.xls"/>
      <instance id="seconddata" src="jr://files/badsubpath.csv"/>
      <instance id="thirddata" src="jr://file/goodone.csv"/>
      <instance id="fourthdata" src="jr://file/path/to/badnestedfile.csv"/>
      <bind nodeset="/data/name" type="string"/>
      <bind type="int" nodeset="/data/age"/>
      <bind nodeset="/data/hometown" type="select1"/>
      <itext>
        <translation default="true()" lang="en">
          <text id="/data/name:label">
            <value form="audio">jr://audio/goodtwo.mp3</value>
          </text>
        </translation>
      </itext>
    </model>
  </h:head>
</h:html>`,

    itemsets: `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <model>
      <instance>
        <data id="itemsets">
          <name/>
        </data>
      </instance>
      <instance id="itemsets" src="jr://file/itemsets.csv"/>
      <bind nodeset="/data/name" type="string"/>
    </model>
  </h:head>
</h:html>`,

    binaryType: `<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <h:title>Submission </h:title>
    <model>
      <instance>
        <data id="binaryType">
          <meta>
            <instanceID/>
          </meta>
          <file1/>
          <file2/>
        </data>
      </instance>

      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/file1" type="binary"/>
      <bind nodeset="/data/file2" type="binary"/>
    </model>

  </h:head>
  <h:body>
    <upload ref="/data/file1" mediatype="image/*">
      <label>Give me an image.</label>
    </upload>
    <upload ref="/data/file2" mediatype="video/*">
      <label>Give me a video./label>
    </upload>
  </h:body>
</h:html>`,

    encrypted: `<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <h:title>Encrypted</h:title>
    <model>
      <instance>
        <data id="encrypted" version="working3">
          <meta>
            <instanceID/>
          </meta>
          <name/>
          <age/>
          <file/>
        </data>
      </instance>

      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/name" type="string"/>
      <bind nodeset="/data/age" type="int"/>
      <bind nodeset="/data/file" type="binary"/>

      <submission base64RsaPublicKey="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyYh7bSui/0xppQ+J3i5xghfao+559Rqg9X0xNbdMEsW35CzYUfmC8sOzeeUiE4pG7HIEUmiJal+mo70UMDUlywXj9z053n0g6MmtLlUyBw0ZGhEZWHsfBxPQixdzY/c5i7sh0dFzWVBZ7UrqBc2qjRFUYxeXqHsAxSPClTH1nW47Mr2h4juBLC7tBNZA3biZA/XTPt//hAuzv1d6MGiF3vQJXvFTNdfsh6Ckq4KXUsAv+07cLtON4KjrKhqsVNNGbFssTUHVL4A9N3gsuRGt329LHOKBxQUGEnhMM2MEtvk4kaVQrgCqpk1pMU/4HlFtRjOoKdAIuzzxIl56gNdRUQIDAQAB"/>
    </model>

  </h:head>
  <h:body>
    <input ref="/data/name">
      <label>What is your name?</label>
    </input>
    <input ref="/data/age">
      <label>What is your age?</label>
    </input>
    <upload ref="/data/file" mediatype="image/*">
      <label>Give me an image.</label>
    </upload>
  </h:body>
</h:html>`,

    clientAudits: `<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <h:title>Client Audits</h:title>
    <model>
      <instance>
        <data id="audits">
          <meta>
            <instanceID/>
            <audit/>
          </meta>
          <name/>
          <age/>
        </data>
      </instance>

      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/meta/audit" type="binary"/>
      <bind nodeset="/data/name" type="string"/>
      <bind nodeset="/data/age" type="int"/>
    </model>

  </h:head>
  <h:body>
    <input ref="/data/name">
      <label>What is your name?</label>
    </input>
    <input ref="/data/age">
      <label>What is your age?</label>
    </input>
  </h:body>
</h:html>`,

    selectMultiple: `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <model>
      <instance>
        <data id="selectMultiple">
          <q1/>
          <g1><q2/></g1>
        </data>
      </instance>
      <bind nodeset="/data/q1" type="string"/>
      <bind nodeset="/data/g1/q2" type="string"/>
    </model>
  </h:head>
  <h:body>
    <select ref="/data/q1"><label>one</label></select>
    <group ref="/data/g1">
      <label>group</label>
      <select ref="/data/g1/q2"><label>two</label></select>
    </group>
  </h:body>
</h:html>`,

    simpleEntity: `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:jr="http://openrosa.org/javarosa" xmlns:entities="http://www.opendatakit.org/xforms">
  <h:head>
    <model entities:entities-version="2022.1.0">
      <instance>
        <data id="simpleEntity" orx:version="1.0">
          <name/>
          <age/>
          <hometown/>
          <meta>
            <entity dataset="people" id="" create="">
              <label/>
            </entity>
          </meta>
        </data>
      </instance>
      <bind nodeset="/data/name" type="string" entities:saveto="first_name"/>
      <bind nodeset="/data/age" type="int" entities:saveto="age"/>
      <bind nodeset="/data/hometown" type="string"/>
    </model>
  </h:head>
</h:html>`
  },
  instances: {
    simple: {
      one: instance('simple', 'one', '<name>Alice</name><age>30</age>'),
      two: instance('simple', 'two', '<name>Bob</name><age>34</age>'),
      three: instance('simple', 'three', '<name>Chelsea</name><age>38</age>')
    },
    withrepeat: {
      one: fullInstance('withrepeat', '1.0', 'rone', '<name>Alice</name><age>30</age>'),
      two: fullInstance('withrepeat', '1.0', 'rtwo', '<name>Bob</name><age>34</age><children><child><name>Billy</name><age>4</age></child><child><name>Blaine</name><age>6</age></child></children>'),
      three: fullInstance('withrepeat', '1.0', 'rthree', '<name>Chelsea</name><age>38</age><children><child><name>Candace</name><age>2</age></child></children>'),
    },
    simple2: {
      one: instance('simple2', 's2one', '<name>Alice</name><age>30</age>'),
      two: instance('simple2', 's2two', '<name>Bob</name><age>34</age>'),
      three: instance('simple2', 's2three', '<name>Chelsea</name><age>38</age>')
    },
    doubleRepeat: {
      double: `<data id="doubleRepeat" version="1.0">
    <orx:meta><orx:instanceID>double</orx:instanceID></orx:meta>
    <name>Vick</name>
    <children>
      <child>
        <name>Alice</name>
      </child>
      <child>
        <name>Bob</name>
        <toys>
          <toy><name>Twilight Sparkle</name></toy>
          <toy><name>Pinkie Pie</name></toy>
          <toy><name>Applejack</name></toy>
          <toy><name>Spike</name></toy>
        </toys>
      </child>
      <child>
        <name>Chelsea</name>
        <toys>
          <toy><name>Rainbow Dash</name></toy>
          <toy><name>Rarity</name></toy>
          <toy><name>Fluttershy</name></toy>
          <toy><name>Princess Luna</name></toy>
        </toys>
      </child>
    </children>
  </data>`
    },
    binaryType: {
      one: instance('binaryType', 'bone', '<file1>my_file1.mp4</file1>'),
      two: instance('binaryType', 'btwo', '<file2>here_is_file2.jpg</file2>'),
      both: instance('binaryType', 'both', '<file1>my_file1.mp4</file1><file2>here_is_file2.jpg</file2>')
    },
    encrypted: {
      // TODO: the jpg binary associated with this sample blob is >3MB. will replace
      // with something i actually feel comfortable committing.
      one: `<data id="encrypted" version="working3" encrypted="yes" xmlns="http://www.opendatakit.org/xforms/encrypted">
  <base64EncryptedKey>pFT0+tIo8l104xRF8MkyG955oI0eLvdp/Vxy4UH6AvpGVW8fpotfv4Rc51PeDn9jV7kmNk2Q9WGwJs2YmYipxwAZT8genpktoYQR77nT3nqMpkzDfVXLGyl9o8lfuVZNjMRGkaI4Vy7DdsYJI1tkPY03sEopZIBHOl9Du9anyn9FIDbGgcC+W8GDx4jnYRAD3joDFK4wHZTZF7D5/OoDSQjxcMpM6TPmEDPszjHpfXbkf8mtTvy2F5knG9HWmFbaJRy8POC9GQrh68xK8RUJbQX8PBCt/zgR+rTibolgoIKy5KplAS/wKQoi19QfwVRAq9jDzDJeW22tdmBa86X/Fg==</base64EncryptedKey>
  <orx:meta xmlns:orx="http://openrosa.org/xforms"><orx:instanceID>uuid:dcf4a151-5088-453f-99e6-369d67828f7a</orx:instanceID></orx:meta>
  <media><file>1561432508817.jpg.enc</file></media>
  <encryptedXmlFile>submission.xml.enc</encryptedXmlFile>
  <base64EncryptedElementSignature>UHIobs8lmLCeKGoPxVFiwXp5JsItoBEwdgmUPF8evnmvRd7Tm1o1wOh9WQNcTGXU+uBH0c/w4UkcFq/GA7JYzxjuMu8QGbjlVd936MM0ynAsrzRxHkiZChnabObeCYzab24dHZooiraVs/yPeyGKykJRpAz3jcXNEUz9X7qLrscEab0wvFamiNBC0C+YzewMI2hGpdkGC1DikbkPbHKNgeyLHCYduAj7rhjKsuhSeRFHvgqYGF6yfLNX6/M3rEnOFOHuVOH7yvI/eqC5bHM5PAv/w9zkFqn1Se5uQHNf7bgCRfhfwpRiLrfzlyQlVCpuEQuD9r+aDoShU9nA2Iw6LA==</base64EncryptedElementSignature>
</data>`,
      two: `<data id="encrypted" version="working3" encrypted="yes" xmlns="http://www.opendatakit.org/xforms/encrypted">
  <base64EncryptedKey>iyEB1LAlvVE8uaW0HuhLhzwcLceIukqfgusDNdDEE2FFxVtUtSI3FiOuNxhgI/Zbgnaabh/vqeZ3yLXwv0f66pAbN0n8kM9f84VJR18fdUp6doOz7o8IQD7gc3ZfbRXweab/NxnahfYa9ij0Kax1LTKS05Oodk2MewkzwfBhdbf/CfiBP1HSskDio40jdW5f04GkqZsFCPUluF2DfMnwYCo0wdwf2m8o+lSNR+vrFeEYG7LtGE4X90pVrQnJHwFWHGjSwJpg/USn5skBioDKUCv/Dva9xJ+JXUz+QSg6LOuP+SDxsrmf36WKrnE8kWfN4oaBdmIwFSStkLH9foNXUw==</base64EncryptedKey>
  <orx:meta xmlns:orx="http://openrosa.org/xforms"><orx:instanceID>uuid:99b303d9-6494-477b-a30d-d8aae8867335</orx:instanceID></orx:meta>
  <media><file>1561432532482.jpg.enc</file></media>
  <encryptedXmlFile>submission.xml.enc</encryptedXmlFile>
  <base64EncryptedElementSignature>a5A29xMc/7Aas1q1EpxJ/+D8dXsK3I6s9SVyzZRl6+2bILpHvPzG6LuFgTf6SM06Tnr13VNioNJLiTxvxna/nPHak015VSg4TWNvXcDpIbkDNS/2v6BZYv86zrao2DpG2lM9h8oPKy1vbHFcponu1/WVtEgZA/TzNMleJCMKCKQqDxt+n6og1QmWF4LBtsPaGB23ucvziQ57Yp8p+sVvqxs2OrJFYHGJReetqmbIUbyS4xvn3BJQa6BSiNMP35mFSvbLL+sCDSx/PiTTgtJ/oMUP+tqsR376l1TWXQhRHHFsCpwQQeS8GkhjEE6GD1XYscy5ATFv8W0cy2Y6GfN1jA==</base64EncryptedElementSignature>
</data>`
    },
    clientAudits: {
      one: '<data id="audits"><meta><instanceID>one</instanceID><audit>audit.csv</audit></meta><name>Alice</name><age>30</age></data>',
      two: '<data id="audits"><meta><instanceID>two</instanceID><audit>log.csv</audit></meta><name>Bob</name><age>34</age></data>'
    },
    selectMultiple: {
      one: instance('selectMultiple', 'one', '<q1>a b</q1><g1><q2>x y z</q2>'),
      two: instance('selectMultiple', 'two', '<q1>b</q1><g1><q2>m x</q2>'),
      three: instance('selectMultiple', 'three', '<q1> b c</q1>')
    },
    simpleEntity: {
      one: `<data xmlns:jr="http://openrosa.org/javarosa" xmlns:entities="http://www.opendatakit.org/xforms" id="simpleEntity" version="1.0">
              <meta>
                <instanceID>one</instanceID>
                <entities:entity dataset="people" id="uuid:12345678-1234-4123-8234-123456789abc" create="1">
                  <entities:label>Alice (88)</entities:label>
                </entities:entity>
              </meta>
              <name>Alice</name>
              <age>88</age>
            </data>`,
      two: `<data xmlns:jr="http://openrosa.org/javarosa" xmlns:entities="http://www.opendatakit.org/xforms" id="simpleEntity" version="1.0">
            <meta>
              <instanceID>two</instanceID>
              <entities:entity dataset="people" id="uuid:12345678-1234-4123-8234-123456789aaa" create="1">
                <entities:label>Jane (30)</entities:label>
              </entities:entity>
            </meta>
            <name>Jane</name>
            <age>30</age>
          </data>`,
      three: `<data xmlns:jr="http://openrosa.org/javarosa" xmlns:entities="http://www.opendatakit.org/xforms" id="simpleEntity" version="1.0">
          <meta>
            <instanceID>three</instanceID>
            <entities:entity dataset="people" id="uuid:12345678-1234-4123-8234-123456789bbb" create="1">
              <entities:label>John (40)</entities:label>
            </entities:entity>
          </meta>
          <name>John</name>
          <age>40</age>
        </data>`
    }
  }
};

